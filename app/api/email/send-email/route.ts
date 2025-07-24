import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { NextResponse } from "next/server";
import { TEmail } from "@/types";

export async function POST(req: Request) {
  try {
    const data: TEmail = await req.json();

    // ✅ Define the path to the templates directory (from root)
    const templatePath = path.join(process.cwd(), "templates");

    // ✅ Configure transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Use handlebars template engine
    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extname: ".hbs",
          partialsDir: templatePath,
          layoutsDir: templatePath,
          defaultLayout: false,
        },
        viewPath: templatePath,
        extName: ".hbs",
      })
    );

    // ✅ Send the email
    await transporter.sendMail({
      from: `"Rinarah" <${process.env.EMAIL_USER}>`,
      to: data.customerEmail,
      subject: `Your Order #${data.orderId} Confirmation`,
      // @ts-expect-error: template/context are added by nodemailer-express-handlebars
      template: "sendTemplate",
      context: data,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Email sending error:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
