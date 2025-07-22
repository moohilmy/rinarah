import { ShippoResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

const SHIPPO_API = "https://api.goshippo.com/transactions";

async function createShippoLabel(
  rateObjectId: string
): Promise<ShippoResponse> {
  const token = process.env.SHIPPO_TOKEN;
  if (!token) throw new Error("Shippo token is missing in environment");

  const response = await fetch(SHIPPO_API, {
    method: "POST",
    headers: {
      Authorization: `ShippoToken ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      rate: rateObjectId,
      label_file_type: "PDF",
      async: false,
    }),
  });

  if (!response.ok) {
    let errorDetails: unknown;
    try {
      errorDetails = await response.json();
    } catch {
      errorDetails = await response.text();
    }
    console.error("Shippo error:", errorDetails);
    throw new Error(JSON.stringify(errorDetails));
  }

  return await response.json();
}

export async function POST(request: NextRequest) {
  try {
    const { rateObjectId } = await request.json();

    if (!rateObjectId) {
      return NextResponse.json(
        { error: "rateObjectId is required" },
        { status: 400 }
      );
    }

    const data = await createShippoLabel(rateObjectId);
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
