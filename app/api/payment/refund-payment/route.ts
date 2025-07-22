// app/api/payment/refund-payment/route.ts
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.SECRET_API_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  const { payment_intent } = await req.json();

  if (!payment_intent) {
    return NextResponse.json(
      { error: "Missing payment_intent" },
      { status: 400 }
    );
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent,
    });

    return NextResponse.json({ success: true, refund });
  } catch (error: unknown) {
    const err = error as Stripe.errors.StripeError;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
