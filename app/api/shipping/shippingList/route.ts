import { ShippingRateInfo, TShippingInfo } from "@/types";
import { NextRequest, NextResponse } from "next/server";
const senderAddress: TShippingInfo = {
  name: "Rinarah",
  street1: "22 conference ct",
  city: "staten island",
  state: "NY",
  zip: "10307",
  country: "US",
  phone: "+201289935301",
  email: "info@rinarah.com",
};
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { customerAddress, parcel } = body;
  if (Number(parcel.weight) === 0) {
    return new NextResponse(null, { status: 204 });
  }
  try {
    if(process.env.SHIPPO_TOKEN === undefined){
      throw new Error('SHIPPO_TOKEN is undefined')
    }
    const response = await fetch("https://api.goshippo.com/shipments/", {
      method: "POST",
      headers: {
        Authorization: `ShippoToken ${process.env.SHIPPO_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address_from: senderAddress,
        address_to: customerAddress,
        parcels: [parcel],
        async: false,
      }),
    });

    const data = await response.json();

    const validRates: ShippingRateInfo[] = data.rates;
    const filteredRates = validRates
      .sort(
        (a: ShippingRateInfo, b: ShippingRateInfo) =>
          Number(a.amount || 0) - Number(b.amount || 0)
      )
      .filter((i) => i.duration_terms)
      .slice(0, 5);
    return NextResponse.json(filteredRates);
  } catch (error) {
    console.error("error", error);
    throw new Error(`Internal Server Error ${error}`);
  }
}
