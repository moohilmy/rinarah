import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendOrderEmail } from "@/lib/sendOrderEmail"; // المسار حسب مكان ملف الإرسال
import { getOrderByPaymentIntentId } from "@/lib/getOrderByStripeId";

const stripe = new Stripe(process.env.SECRET_API_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const rawBody = await req.arrayBuffer();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
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
      const order = await getOrderByPaymentIntentId(paymentIntent.id);

      if (order) {
        await sendOrderEmail(order); // ✉️ ابعت الإيميل
        console.log("✅ Order email sent successfully.");
      } else {
        console.warn("⚠️ Order not found for PaymentIntent:", paymentIntent.id);
      }
    } catch (err) {
      console.error("❌ Failed to process order:", err);
    }
  }

  return new NextResponse("✅ Webhook received", { status: 200 });
}
