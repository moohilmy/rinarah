"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { IoIosArrowDown } from "react-icons/io";
import { checkoutSchema, ICheckoutForm } from "@/validation";
import StateSection from "../StateSection/StateSection";
import ShippingList from "../ShippingList/ShippingList";
import { TextInput } from "@/components/CheckoutComponents/TextInpunt/TextInpunt";
import { useCartStore } from "@/store";
import { LoadingPage } from "@/loading";
import { useRouter } from "next/navigation";
import { convertToSubcurrency } from "@/utils";
import { ShippoResponse, TAddress, TOrder } from "@/types";
import { ValidateAddressesResponse } from "@/app/api/shipping/validate-Address/route";

export function CheckoutFormField() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    trigger,
  } = useForm<ICheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
  });

  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const weight = useCartStore((s) => s.totalWeight());
  const total = useCartStore((s) => s.grandTotal());
  const clear = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) => s.subtotal());
  const tax = useCartStore((s) => s.tax());
  const totalItems = useCartStore((s) => s.items);
  const secret = useCartStore((s) => s.clientSecret);
  const setClientSecret = useCartStore((s) => s.setClientSecret);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const createShippingLabel = useCallback(
    async (objectId: string): Promise<ShippoResponse> => {
      const res = await fetch("/api/shipping/get-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rateObjectId: objectId }),
      });
      if (!res.ok) throw new Error("Failed to create shipping label");
      const data = await res.json();
      return {
        transactionId: data.object_id,
        rateId: data.rate,
        status: data.status,
        messages: data.messages,
        trackingNumber: data.tracking_number,
        trackingStatus: data.tracking_status,
        labelUrl: data.label_url,
        objectState: data.object_state,
      };
    },
    []
  );

  const updatePaymentIntent = async (intentId: string, amount: number) => {
    const res = await fetch("/api/payment/update-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intentId, amount }),
    });
    return await res.json();
  };

  const createOrder = useCallback(async (order: TOrder) => {
    const res = await fetch("/api/order/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error("Order creation failed");
  }, []);

  const checkIsValidateAddress = async (address: TAddress) => {
    const res = await fetch("/api/shipping/validate-Address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address),
    });

    const data: ValidateAddressesResponse = await res.json();

    if (!data.result.validation_results.is_valid) {
      return router.replace(
        `/checkout/failure?error=${encodeURIComponent(
          "Shipping Failed"
        )}&errorMessage=${encodeURIComponent(data.errorMessage || "")}`
      );
    }
    return true;
  };

  if (!hydrated) return <LoadingPage />;

  const onSubmit: SubmitHandler<ICheckoutForm> = async (data) => {
    if (!stripe || !elements || !secret?.id) return;

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const isValidateAddress = await checkIsValidateAddress({
        street1: data.address,
        city: data.city,
        country: data.country,
        zip: data.zipCode,
        state: data.state,
      });
      if (isValidateAddress !== true) {
        return;
      }
      const snapshotTotal = total;
      const snapshotItems = [...totalItems];

      const res = await updatePaymentIntent(
        secret.id,
        convertToSubcurrency(snapshotTotal)
      );
      if (!res.ok) throw new Error("Failed to update payment intent");

      setClientSecret({ id: secret.id, clientSecret: res.clientSecret });

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: `${data.firstName} ${data.lastName}`,
              email: data.email,
              phone: data.phoneNumber,
              address: {
                line1: data.address,
                city: data.city,
                state: data.state,
                country: data.country,
                postal_code: data.zipCode,
              },
            },
          },
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage("Payment failed: " + error.message);
        return router.replace(
          `/checkout/faliure?errorName=${error.source}&errorMessage=${error.message}`
        );
      }

      if (paymentIntent?.status === "succeeded") {

        
        
        const shippo = await createShippingLabel(data.shippingInfo.objectId);
        const newOrder: TOrder = {
          stripePaymentIntentId: paymentIntent.id,
          paymentStatus: paymentIntent.status,
          subtotal,
          tax,
          amountTotal: snapshotTotal,
          currency: paymentIntent.currency,
          customerEmail: data.email,
          shipping: {
            name: `${data.firstName} ${data.lastName}`,
            phone: data.phoneNumber,
            shippingPrice: data.shippingInfo.rate,
            address: {
              line1: data.address,
              city: data.city,
              state: data.state,
              zip: data.zipCode,
              country: data.country,
            },
          },
          shippo: {
            status: shippo.status,
            labelUrl: shippo.labelUrl,
            rateId: shippo.rateId,

            trackingNumber: shippo.trackingNumber,
            trackingStatus: shippo.trackingStatus,
            messages: shippo.messages,
            transactionId: shippo.transactionId,
            objectState: shippo.objectState,
          },
          status: paymentIntent.status,
          items: snapshotItems.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        };

        await createOrder(newOrder);
        clear();
        router.replace(`/checkout/success?pi=${paymentIntent.id}`);
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {errorMessage && (
        <p className="text-red-500 font-medium text-sm mb-4">{errorMessage}</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* -------- Contact -------- */}
        <section className="flex flex-col gap-4">
          <h2 className="rinarah-checkout-title">Contact</h2>
          <div className="rinarah-checkout-box">
            <input
              id="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              className="rinarah-checkout-input"
              {...register("email")}
              disabled={isSubmitting}
            />
            <label htmlFor="email" className="rinarah-checkout-label">
              Email
            </label>
            {errors.email && (
              <span className="rinarah-error-message">
                {errors.email.message}
              </span>
            )}
          </div>
        </section>

        {/* -------- Delivery -------- */}
        <section className="flex flex-col gap-4 mt-4">
          <h2 className="rinarah-checkout-title">Delivery</h2>

          {/* Country */}
          <div className="rinarah-checkout-box relative">
            <select
              id="country"
              defaultValue=""
              className="rinarah-checkout-select"
              {...register("country")}
              disabled={isSubmitting}
            >
              <option value="">Select a country</option>
              <option value="US">United States</option>
            </select>
            <label htmlFor="country" className="rinarah-checkout-label-state">
              Country/Region
            </label>
            <span className="rinarah-checkout-arrow">
              <IoIosArrowDown />
            </span>
            {errors.country && (
              <span className="rinarah-error-message">
                {errors.country.message}
              </span>
            )}
          </div>

          {/* Names */}
          <div className="flex gap-4">
            <TextInput
              id="firstName"
              label="First Name"
              placeholder="First Name"
              autoComplete="given-name"
              error={errors.firstName}
              {...register("firstName")}
              disabled={isSubmitting}
            />
            <TextInput
              id="lastName"
              label="Last Name"
              placeholder="Last Name"
              autoComplete="family-name"
              error={errors.lastName}
              {...register("lastName")}
              disabled={isSubmitting}
            />
          </div>

          <TextInput
            id="phoneNumber"
            type="tel"
            placeholder="Phone Number"
            autoComplete="tel"
            label="Phone Number"
            error={errors.phoneNumber}
            {...register("phoneNumber")}
            disabled={isSubmitting}
          />

          <TextInput
            id="address"
            label="Address"
            placeholder="Address"
            autoComplete="street-address"
            error={errors.address}
            {...register("address")}
            disabled={isSubmitting}
          />

          <StateSection
            setValue={setValue}
            trigger={trigger}
            control={control}
            register={register}
            errors={errors}
          />
        </section>

        {/* -------- Shipping -------- */}
        <section className="flex flex-col gap-4 mt-4">
          <h2 className="rinarah-checkout-title">Shipping method</h2>
          <ShippingList
            control={control}
            errors={errors}
            weight={weight}
            setValue={setValue}
            register={register}
          />
        </section>

        {/* -------- Payment -------- */}
        <section className="flex flex-col gap-4 mt-4">
          <h2 className="rinarah-checkout-title">Payment method</h2>
          <p className="mt-1 text-xs font-bold text-gradient-color">
            All transactions are secure and encrypted.
          </p>
          <PaymentElement options={{ layout: "tabs" }} />
        </section>

        <button
          type="submit"
          className="rinarahBtn mt-6 w-full"
          disabled={!stripe || isSubmitting}
        >
          {isSubmitting ? "Processing..." : `Pay ${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
