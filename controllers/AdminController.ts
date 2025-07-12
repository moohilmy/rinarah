import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib";
import { serialize } from "cookie";
import { Admin, CreateToken, validateLoginUser } from "@/modules/Admin";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


export const LoginAdmin = async (req: NextRequest) => {
  try {
    await connectDB();
    const body = await req.json();
    const { error } = validateLoginUser(body);
    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ userName: body.userName });
    if (!admin) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(body.password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    const updateLogin = await Admin.findByIdAndUpdate(
      admin._id,
      {
        LastDateLogIn: Date.now(),
      },
      {
        new: true,
      }
    ).select("-password");

    const token = CreateToken(admin.id.toString());

    const response = NextResponse.json({
      message: "Login successful",
      updateLogin,
    });

    response.headers.set(
      "Set-Cookie",
      serialize("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 2,
      })
    );

    return response;
  } catch (err) {
    console.error("[LoginAdmin Error]", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
export const CheckLogin = async (req: NextRequest) => {
  await connectDB();
  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      _id: string;
      iat: number;
      exp: number;
    };
    
    const admin = await Admin.findById(decoded._id).select("userName LastDateLogIn");

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({
      userName: admin.userName,
      lastDateLogIn: admin.LastDateLogIn,
    });

  } catch (error) {
    return NextResponse.json({ message: `Invalid token ${error}`}, { status: 401 });
  }
};
