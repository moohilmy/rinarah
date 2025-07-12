import { getProductbyID } from "@/controllers/ProductController";
import { connectDB } from "@/lib";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ productID: string }> }
) {
  await connectDB();
  return await getProductbyID(req,context);
}
