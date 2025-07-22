import { updateEmailSent } from "@/controllers/OrderController";
import { connectDB } from "@/lib";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ orderID: string }> }
) {
  await connectDB();
  const { orderID } = await context.params;
  return await updateEmailSent(orderID);
}
