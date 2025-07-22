"use client";

import { useEffect, useRef } from "react";
import { Elements } from "@stripe/react-stripe-js";
import styles from "./styles.module.css";
import { useCartStore } from "@/store";
import { LoadingPage } from "@/loading";
import { convertToSubcurrency } from "@/utils";
import { stripe } from "@/lib/stripe";
import { CheckoutFormField } from "../CheckoutFormfield/CheckoutFormfield";

export default function CheckoutForm() {
  const amount = useCartStore((s) => s.subtotal());
  const secret = useCartStore((s) => s.clientSecret);
  const setClientSecret = useCartStore((s) => s.setClientSecret);
  const createdRef = useRef(false);
  useEffect(() => {
    if (secret?.clientSecret || createdRef.current) return;
    createdRef.current = true;
    (async () => {
      const res = await fetch("/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
      }).then((res) => res.json());

      setClientSecret({
        id: res.id,
        clientSecret: res.clientSecret,
      });
    })();
  }, [amount, secret, setClientSecret]);

  if (!secret?.clientSecret) return <LoadingPage />;

  return (
    <div className={styles.checkoutForm}>
      <Elements
        stripe={stripe}
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
        <CheckoutFormField />
      </Elements>
    </div>
  );
}
