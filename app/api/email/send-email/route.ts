import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { NextResponse } from "next/server";
import { fileURLToPath } from "url";

// Dynamic path handling for Next.js (ESM workaround)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Set handlebars config
    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extname: ".hbs",
          partialsDir: path.join(__dirname, "../../../templates"),
          layoutsDir: path.join(__dirname, "../../../templates"),
          defaultLayout: false,
        },
        viewPath: path.join(__dirname, "../../../templates"),
        extName: ".hbs",
      })
    );

    // Send the email
    await transporter.sendMail({
      from: `"Rinarah" <${process.env.EMAIL_USER}>`,
      to: data.billing.email,
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
