
import { CreateProduct } from "@/controllers/ProductController";
import { connectDB } from "@/lib";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ AdminID: string }> }
) {
  await connectDB();
  return await CreateProduct(req,context);
}