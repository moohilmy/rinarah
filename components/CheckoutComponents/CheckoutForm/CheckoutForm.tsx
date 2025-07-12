"use client";

import { useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import styles from "./styles.module.css";

import { useCartStore } from "@/store";
import { LoadingPage } from "@/loading";
import { convertToSubcurrency } from "@/utils";
import { stripePromise } from "@/lib/stripe";
import { CheckoutFormField } from "../CheckoutFormfield/CheckoutFormfield";

export default function CheckoutForm() {
  const amount = useCartStore((s) => s.subtotal());
  const secret = useCartStore((s) => s.clientSecret);
  const setClientSecret = useCartStore((s) => s.setClientSecret);
  useEffect(() => {
    console.log(secret);

    if (secret) return;

    (async () => {
      const res = await fetch("/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
      });

      const data = await res.json();
      console.log(data);

      setClientSecret(data);
    })();
  }, [amount, secret, setClientSecret]);

  if (!secret) return <LoadingPage />;

  return (
    <div className={styles.checkoutForm}>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret: secret.clientSecret,
          appearance: {
            theme: "flat",
            variables: {
              colorPrimary: "#562a17",
              colorBackground: "#EDb05b",
              colorText: "#562a17",
            },
          },
        }}
      >
        <CheckoutFormField amount={amount} />
      </Elements>
    </div>
  );
}
