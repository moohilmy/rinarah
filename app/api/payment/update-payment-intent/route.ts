import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.SECRET_API_KEY as string, {
  apiVersion: "2025-04-30.basil",
});
export async function POST(req: NextRequest) {
  const { intentId, amount } = await req.json();
  console.log(amount);

  const intent = await stripe.paymentIntents.update(intentId, {
    amount,
  });
  return NextResponse.json({ ok: true, clientSecret: intent.client_secret });
}
