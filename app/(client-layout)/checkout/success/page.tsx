// app/(shop)/checkout/success/page.tsx
import { notFound } from "next/navigation";
import Stripe from "stripe";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (!session_id) return notFound(); 
  

  const stripe = new Stripe(process.env.SECRET_API_KEY!, {
    apiVersion: "2025-04-30.basil",
  });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent"],
    });

    if (session.payment_status !== "paid") return notFound();

    const paymentIntent = session.payment_intent as Stripe.PaymentIntent;

    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">شكراً لطلبك! 🎉</h1>
        <p>رقم الأوردر هو <b>{paymentIntent.id}</b></p>
      </div>
    );
  } catch (err: unknown)  {
    // لو حصل error من نوع resource_missing
    if (
      typeof err === "object" &&
      err !== null &&
      "type" in err &&
      "code" in err &&
      (err as { type?: string; code?: string }).type === "StripeInvalidRequestError" &&
      (err as { type?: string; code?: string }).code === "resource_missing"
    ) {
      return notFound();
    }

    // ممكن تطبع أي خطأ آخر أو تسجّله
    console.error("Stripe error:", err);
    return notFound();
  }
}
