// middlewares/auth.middleware.ts
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { Admin } from "@/modules/Admin"; // import your Admin model

export const verifyAdmin = async (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("RLUX ")) {
    return { valid: false, message: "Authorization header missing" };
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };

    const admin = await Admin.findById(payload._id) as { _id: { toString: () => string } } | null;
    if (!admin) {
      return { valid: false, message: "Not allowed. Only existing admins can access." };
    }

    return { valid: true, payload: { _id: admin._id.toString() } };
  } catch (err) {
    return { valid: false, message: `Invalid token ${err}`};
  }
};
