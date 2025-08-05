import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { TOrder } from "@/types/OrderType";

export const sendOrderEmail = async (order: TOrder) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });
    const templatePath = path.join(process.cwd(), "templates");
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

    const mailOptions = {
      from: '"Order Notifier" <' + process.env.EMAIL_USER + ">",
      to: process.env.ORDER_NOTIFICATION_EMAIL!,
      subject: `🧾 New Order: ${order.stripePaymentIntentId}`,
      template: "order-notification", // اسم ملف HBS بدون .hbs
      context: order,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Order email sent successfully");
  } catch (error) {
    console.error("❌ Failed to send order email:", error);
    throw new Error("Could not send order notification email");
  }
};
