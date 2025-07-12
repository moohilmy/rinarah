
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    const { rateObjectId } = await request.json();
    if (!rateObjectId) {
      return NextResponse.json(
        { error: "rateObjectId is required" },
        { status: 400 }
      );
    }

    const shippoRes = await fetch("https://api.goshippo.com/transactions", {
      method: "POST",
      headers: {
        Authorization: `ShippoToken ${process.env.SHIPPO_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        rate: rateObjectId,
        label_file_type: "PDF",
        async: false,
      }),
    });

    if (!shippoRes.ok) {
      let errBody: unknown;
      try {
        errBody = await shippoRes.json();
      } catch {
        errBody = await shippoRes.text();
      }

      console.error("Shippo error:", errBody);
      return NextResponse.json(
        { error: errBody },
        { status: shippoRes.status }
      );
    }

    const data = await shippoRes.json();
    console.log("Shippo response:", data);
    
    return NextResponse.json(
      {
        labelUrl: data.label_url,
        tracking: data.tracking_number,
        id: data.object_id,
        trackingUrl: data.tracking_url_provider,
        createdAt: data.object_created,
        rateObjectId: data.rate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
