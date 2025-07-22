import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.SECRET_API_KEY as string, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    const { intentId, amount } = await req.json();

    
    if (!intentId || !amount || typeof amount !== "number") {
      return NextResponse.json(
        { error: "Missing or invalid parameters" },
        { status: 400 }
      );
    }

    const intent = await stripe.paymentIntents.update(intentId, {
      amount,
    });

    return NextResponse.json({
      ok: true,
      clientSecret: intent.client_secret,
    });
  } catch (err) {
    console.error("Stripe update error:", err);
    return NextResponse.json(
      { error: "Failed to update payment intent", message: err },
      { status: 500 }
    );
  }
}
