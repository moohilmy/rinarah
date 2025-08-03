import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib";
import { Order } from "@/modules/Orders";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.event === "track_updated") {
      const trackingNumber = body.data.tracking_number;
      const trackingStatus = body.data.tracking_status?.status;
      const objectStatus = body.data.object_status;

      await connectDB();

      const updatedOrder = await Order.findOneAndUpdate(
        { "shippo.trackingNumber": trackingNumber },
        {
          "shippo.trackingStatus": trackingStatus,
          "shippo.objectState": objectStatus,
          status: objectStatus,
        },
        { new: true }
      );

      if (updatedOrder) {
        console.log("✅ Order updated:", updatedOrder._id);
      } else {
        console.log("⚠️ Order not found for tracking number:", trackingNumber);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
