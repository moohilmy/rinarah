import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing mail credentials");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `Message from ${name}`,
      html: `<p>${message}</p>`,
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json(
      { success: false, message: "Failed to send email", error: String(err) },
      { status: 500 }
    );
  }
}
