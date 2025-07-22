// lib/shippo.ts
const SHIPPO_API_KEY = process.env.SHIPPO_TOKEN!;

export const cancelShippoLabel = async (transactionId: string) => {
  const url = `https://api.goshippo.com/transactions/${transactionId}/cancel`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `ShippoToken ${SHIPPO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // Post body required even if empty
    });

    if (!res.ok) {
      const errorText = await res.text(); // useful for logging
      throw new Error(`Shippo cancel failed with ${res.status}: ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Shippo cancel error:", error);
    throw new Error("Could not cancel Shippo label.");
  }
};
