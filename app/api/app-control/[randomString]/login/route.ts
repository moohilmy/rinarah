import { LoginAdmin } from "@/controllers/AdminController";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  context: { params: Promise<{ randomString: string }> }
) => {
  const { randomString } = await context.params;

  console.log(randomString, process.env.SECRET_URL);

  if (!randomString || randomString !== process.env.SECRET_URL) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return await LoginAdmin(req);
};
