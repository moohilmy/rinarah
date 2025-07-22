import { notFound } from "next/navigation";
import Link from "next/link";
import { checkOrderIsCorrect } from "@/utils";
import { TEmail, TOrder } from "@/types";
import Stripe from "stripe";
const stripe = new Stripe(process.env.SECRET_API_KEY!, {
  apiVersion: "2025-04-30.basil",
});
const sentEmail = async (emailBody: TEmail) => {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/email/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailBody),
    });
    return await res.json();
  } catch (error) {
    console.error("error is", error);
    throw new Error("Failed to send email");
  }
};
const emailSent = async (id: string) => {
  try {
    await fetch(`${process.env.BASE_URL}/api/order/updateEmail/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("error is", error);
    throw new Error("Failed to send email");
  }
};
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ pi?: string }>;
}) {
  const { pi } = await searchParams;
  if (!pi) return notFound();

  const order: TOrder = await checkOrderIsCorrect(pi);

  if (!order) return notFound();

  const {
    subtotal,
    tax,
    items,
    amountTotal,
    shipping,
    stripePaymentIntentId,
    customerEmail,
  } = order;

  const paymentIntent = await stripe.paymentIntents.retrieve(
    stripePaymentIntentId
  );
  const paymentMethodType = await stripe.paymentMethods.retrieve(
    paymentIntent.payment_method as string
  );

  if (!order.isEmailSent) {
    const timeCreateOrder = new Date(order?.createdAt as string).toLocaleString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    );
    const total = Number(amountTotal.toFixed(2));

    const paymentMethod =
      paymentMethodType.card?.brand +
      " ending in " +
      paymentMethodType.card?.last4;

    sentEmail({
      customerEmail,
      customerName: shipping.name,
      orderId: stripePaymentIntentId,
      orderDate: timeCreateOrder,
      subtotal,
      tax: Number(tax.toFixed(2)),
      paymentMethod,
      total,
      items,
      shipping: shipping.shippingPrice,
      billing: shipping,
    });

    await emailSent(order?._id as string);
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-[#fdfae3]">
      <div className="max-w-xl w-full text-center bg-white rounded-2xl shadow-xl px-8 py-10 border border-primary/20">
        <h1 className="text-4xl font-bold text-second-color mb-4">
          🎉 Thank you for your order!
        </h1>

        <p className="text-lg text-gray-700 mb-2">
          Your payment was successful.
        </p>

        <p className="text-lg font-medium text-gray-800 mb-6">Order Number:</p>

        <p className="text-md font-mono bg-primary text-background px-5 py-2 rounded-lg tracking-wide inline-block mb-6">
          {order.stripePaymentIntentId}
        </p>

        <p className="text-sm text-gray-600 mb-8">
          A confirmation email has been sent to{" "}
          <span className="font-semibold text-black">{customerEmail}</span>
        </p>

        <Link
          href="/"
          className="inline-block bg-second-color hover:bg-second-color/90 text-white font-semibold text-base px-6 py-3 rounded-xl transition duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
