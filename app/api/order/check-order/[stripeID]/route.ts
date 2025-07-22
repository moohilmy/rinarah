import { checkOrderInDB } from "@/controllers/OrderController";
import { connectDB } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ stripeID: string }>  }
) {
  await connectDB();

  const { stripeID } = await context.params;

  if (!stripeID) {
    return NextResponse.json(
      { message: "Missing Stripe PaymentIntent ID" },
      { status: 400 }
    );
  }

  return await checkOrderInDB(stripeID);
}
