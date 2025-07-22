import { createOrder } from "@/controllers/OrderController";
import { connectDB } from "@/lib";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();
  return await createOrder(request)
}
