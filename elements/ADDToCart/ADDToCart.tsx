"use client";
import React, { useState } from "react";
import { useCartStore } from "@/store";
import { CartType } from "@/types";
import styles from './styles.module.css'
export default function ADDToCart({ item }: { item: CartType }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const [isError, setIsError] = useState<boolean>(false);
  const onClickHandler = () => {
    const success = addToCart(item);
    if (!success) {
      setIsError(true)
    } else {
      setIsError(false)
    }
  };
  return (
    <div className=" relative">
      {isError && <p className="error-message">You have reached the maximum limit for this product</p>}
      <button className={`rinarahBtn ${styles.customBtn}`} onClick={onClickHandler}>
        add To cart
      </button>
    </div>
  );
}
