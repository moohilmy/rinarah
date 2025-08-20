import { ApproveProduct } from "@/controllers/ProductController";
import { connectDB } from "@/lib";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ AdminID: string; productID: string }> }
) {
  await connectDB();
  return ApproveProduct(req, context);
}
