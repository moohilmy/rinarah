import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.SECRET_API_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function GET(req: NextRequest) {
  const session_id = req.nextUrl.searchParams.get("pi");

  if (!session_id) {
    return NextResponse.json({ error: "Session ID not provided" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    return NextResponse.json({
      customer_email: session.customer_details?.email,
    });
  } catch (error) {
    console.error("Stripe error:", error);

    return NextResponse.json(
      {
        error: "Failed to retrieve session from Stripe",
        message: "Unknown error",
      },
      { status: 500 }
    );
  }
}
