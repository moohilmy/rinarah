"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RefundButton({ pi }: { pi: string }) {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRefund = async () => {
    setLoading(true);
    setMessage("Processing refund...");

    try {
      const res = await fetch(`/api/order/cancell-order`, {
        method: "DELETE",
        body: JSON.stringify({
          stripeID: pi,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage("Refund successful! ✅");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setMessage("Refund failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      setMessage("Something went wrong.");
      console.error("something error", err);
      throw new Error("something error");
    }

    setLoading(false);
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleRefund}
        disabled={loading}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        {loading ? "Processing..." : "Cancel Order & Refund"}
      </button>
      {message && (
        <p
          className={`mt-2 text-sm ${
            message.includes("failed") || message.includes("wrong")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
