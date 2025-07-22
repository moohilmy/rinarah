import { notFound } from "next/navigation";
import Link from "next/link";
import { checkOrderIsCorrect } from "@/utils";
import { TEmail, TOrder } from "@/types";

const sentEmail = async (emailBody: TEmail) => {
  try {
    const res = await fetch("/api/email/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailBody)
    });
    return await res.json()
  } catch (error) {
    console.error('error is', error);
    throw new Error('Failed to send email');
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

    sentEmail({
      customerEmail: customerEmail,
      customerName: shipping.name,
      orderId: stripePaymentIntentId,
      orderDate: timeCreateOrder,
      subtotal,
      tax,
      paymentMethod: 'cvajva',
      total: amountTotal,
      items,
      billing: {
        shipping: {
          name: shipping.name,
          address: shipping.address,
          shippingPrice: shipping.shippingPrice,
          phone: shipping.phone,
        },
      },
    });
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-6 py-10 text-center">
      <h1 className="text-3xl font-bold text-second-color mb-4">
        Thank you for your order! 🎉
      </h1>
      <p className="text-lg mb-2">
        Your payment was successful. Your order number is:
      </p>
      <p className="text-md text-background bg-primary px-4 py-2 rounded-md mb-6">
        {order.stripePaymentIntentId}
      </p>

      <Link href="/" className="inline-block rinarahBtn">
        Back to Home
      </Link>
    </div>
  );
}


