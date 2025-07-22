// /app/api/validate-address/route.ts
import { TAddress } from "@/types";
import { NextRequest, NextResponse } from "next/server";
type validateAddresses = {
  validation_results: {
    is_valid: boolean;
    messages: {
      text?: string;
      code?: string;
      type?: string;
      source?: string;
    }[];
  };
};
export type ValidateAddressesResponse = {
  result: validateAddresses;
  errorMessage?: string;
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: TAddress = await req.json();

    const shippoRes = await fetch("https://api.goshippo.com/addresses/", {
      method: "POST",
      headers: {
        Authorization: `ShippoToken ${process.env.SHIPPO_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
        validate: true,
      }),
    });

    const result: validateAddresses = await shippoRes.json();

    if (!shippoRes.ok || !result?.validation_results?.is_valid) {
      const errorMessage =
        result.validation_results.messages
          ?.map((msg) => msg.text)
          .join(" | ") || "Address validation failed";

      return NextResponse.json<ValidateAddressesResponse>(
        { result, errorMessage },
        { status: 400 }
      );
    }

    return NextResponse.json<ValidateAddressesResponse>({ result });
  } catch (err) {
    console.error("Address validation error:", err);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
