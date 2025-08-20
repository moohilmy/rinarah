
import { GetProductsNeedApprove } from "@/controllers/ProductController";
import { connectDB } from "@/lib";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ AdminID: string }> }
) {
  await connectDB();
  
  return await GetProductsNeedApprove(req,context);
}