import { getALlProductsApproved } from "@/controllers/ProductController";
import { connectDB } from "@/lib";

export async function GET() {
    
    await connectDB()
    return await getALlProductsApproved()
}