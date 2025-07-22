import { cancellOrder } from "@/controllers/OrderController";
import { connectDB } from "@/lib";
import {  NextRequest, NextResponse } from "next/server";

export async function DELETE( req : NextRequest  ) {
  await connectDB();
  const { stripeID } = await req.json();

  console.log(stripeID);
  
  if (!stripeID) {
    return NextResponse.json(
      { message: "Missing Stripe PaymentIntent ID" },
      { status: 400 }
    );
  }

  return await cancellOrder(stripeID);
}
