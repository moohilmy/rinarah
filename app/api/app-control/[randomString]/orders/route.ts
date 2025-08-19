import { getAllOrders } from "@/controllers/OrderController";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ randomString: string }> }
) => {
  const { randomString } = await context.params;


  if (!randomString || randomString !== process.env.SECRET_URL) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return await getAllOrders(req);
};
