"use client";
import { useCartStore } from "@/store";
import styles from "./styles.module.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useEffect, useState } from "react";
import { CheckoutList } from "@/components";
export default function OurSummary() {
  const totalPrice = useCartStore((state) => state.grandTotal());
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);
  const onClickHandler = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <aside className={styles.summary}>
      <button
        className={`${styles.centerContent} ${styles.btn}`}
        disabled={!hydrated}
        onClick={onClickHandler}
      >
        <div className={styles.btnContent}>
          <h2 className={styles.summaryTitle}>
            Order Summary {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </h2>
          <p className={styles.priceSummary}>
            {hydrated ? (
              `$${totalPrice.toFixed(2)}`
            ) : (
              <span className={styles.priceSkeleton}></span>
            )}
          </p>
        </div>
      </button>
      <div className={styles.centerContent}>
        {isOpen && (
          <div className={styles.summaryContent}>
            <CheckoutList />
          </div>
        )}
      </div>
    </aside>
  );
}
