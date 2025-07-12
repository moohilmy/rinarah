// app/components/CheckoutFormWrapper.tsx
"use client";

import { LoadingPage } from "@/loading";
import { useCartStore } from "@/store";
import { convertToSubcurrency } from "@/utils";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe"; // Moved here
import { useEffect } from "react";

export default function CheckoutFormWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const amount = useCartStore((s) => s.grandTotal());
  const secret = useCartStore((s) => s.clientSecret);
  const setClientSecret = useCartStore((s) => s.setClientSecret);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
      });
      const data = await res.json();
      setClientSecret(data);
    })();
  }, [amount, setClientSecret]);

  if (!secret) return <LoadingPage />;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: secret.clientSecret,
        appearance: {
          theme: "flat",
          variables: {
            colorPrimary: "#8e984a",
            colorBackground: "#dcdfb7",
            colorText: "#000000",
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}
