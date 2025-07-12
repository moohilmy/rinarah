import { NextRequest } from "next/server";
import { CheckLogin } from "@/controllers/AdminController";

export async function GET(req: NextRequest) {
  return await CheckLogin(req);
}
