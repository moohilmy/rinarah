"use client";
import { useEffect, useState } from "react";
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
export function CheckoutFormField({ amount }: { amount: number }) {
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
  const clear = useCartStore((s) => s.clearCart);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  if (!hydrated) return <LoadingPage />;
  const onSubmit: SubmitHandler<ICheckoutForm> = async (data) => {
    if (!stripe || !elements) return;

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
          
        //   return_url: "http://localhost:3000/products",
        },
        redirect: "if_required",
      })

  
      
    if (error) {
      // ⬇️ إلى صفحة الفشل ومعاها سبب الفشل لو حابب
      console.log("Payment error:", error);
      
      router.replace(`/checkout/failure?reason=${error.type}`);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      console.log({
        stripePaymentIntentId : paymentIntent.id,
        customerEmail: data.email,
        paymentMethod: paymentIntent.payment_method,
        amountTotal: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        paymentStatus: paymentIntent.status,
      });
      
      // استدعاء Shippo بعد التأكد إن الدفع تم
      await fetch("/api/shipping/get-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rateObjectId: data.shippingInfo.objectId }),
      });
      clear()
      router.replace(`/checkout/success?pi=${paymentIntent.id}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} >
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
            />
            <TextInput
              id="lastName"
              label="Last Name"
              placeholder="Last Name"
              autoComplete="family-name"
              error={errors.lastName}
              {...register("lastName")}
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
          />

          {/* Address */}
          <TextInput
            id="address"
            label="Address"
            placeholder="Address"
            autoComplete="street-address"
            error={errors.address}
            {...register("address")}
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
          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />
        </section>

        <button type="submit" className="rinarahBtn mt-6 w-full" disabled={!stripe}>
          Pay ${amount.toFixed(2)}
        </button>
      </form>
    </div>
  );
}
