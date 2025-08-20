import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendOrderEmail } from "@/lib/sendOrderEmail";
import { getOrderByPaymentIntentId } from "@/lib/getOrderByStripeId";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.SECRET_API_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const header = await headers();
  const sig = header.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed.", err);
    return new NextResponse(`Webhook Error: ${err}`, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    try {
      await new Promise((resolve) => setTimeout(resolve, 30 * 1000));
      const order = await getOrderByPaymentIntentId(paymentIntent.id);

      if (order) {
        await sendOrderEmail(order);
      } else {
        console.warn("⚠️ Order not found for PaymentIntent:", paymentIntent.id);
      }
    } catch (err) {
      console.error("❌ Failed to send delayed order email:", err);
    }
  }

  return new NextResponse("✅ Webhook received", { status: 200 });
}
