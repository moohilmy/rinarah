"use client";
import { BsBag } from "react-icons/bs";
import styles from "./styles.module.css";
import { useCartStore } from "@/store";
import { useEffect, useState } from "react";

export default function CheckoutElemant() {
  const totalItems = useCartStore((s) => s.totalCount);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div className={styles.cartElemant}>
      {!hydrated ? (
        <span className={'popupNumSkeleton'}></span>
      ) : (
        <span className={'popupNum'}>{totalItems}</span>
      )}
      <BsBag />
    </div>
  );
}
