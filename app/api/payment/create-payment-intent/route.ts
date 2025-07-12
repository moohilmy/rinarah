import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.SECRET_API_KEY as string, {
  apiVersion: "2025-04-30.basil",
});
export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    return NextResponse.json({
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Internal Error", error);
    return NextResponse.json(
      { error: `InternalServer Error: ${error}` },
      { status: 500 }
    );
  }
}
