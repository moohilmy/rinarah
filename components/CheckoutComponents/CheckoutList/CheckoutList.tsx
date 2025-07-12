"use client";
import { IoMdClose } from "react-icons/io";
import { useCartStore } from "@/store";
import Image from "next/image";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { CheckoutSkeleton } from "@/loading";
import { ClearCart } from "@/elements";

export default function CheckoutList() {
  const itemsList = useCartStore((state) => state.items);
  const shippingCost = useCartStore((state) => state.shippingCost);
  const subTotalPrice = useCartStore((state) => state.subtotal());
  const totalPrice = useCartStore((state) => state.grandTotal())
  const salesTax = useCartStore((state) => state.tax())
  const removeItem = useCartStore((state) => state.removeFromCart);
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return <CheckoutSkeleton styles={styles} />;
  }
  

  return (
    <div className={styles.checkoutList}>
      <ClearCart />
      <ul className={styles.iteamsInCart}>
        {itemsList.map(({ id, image, name, price, quantity }) => (
          <li className={styles.itemCart} key={id}>
            <div className={styles.itemInfo}>
              <div className=" relative">
                <div className={styles.itemCartImage}>
                  <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <span className="popupNum">{quantity}</span>
              </div>
              <div className={styles.itemDetails}>
                <h1 className={styles.itemHeader}>{name}</h1>
                <span className={styles.itemPrice}>{price.toFixed(2)}$</span>
              </div>
            </div>
            <div className={styles.clearBtn} onClick={() => removeItem(id)}>
              <span>clear</span>
              <IoMdClose />
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.checkoutInfo}>
        <div className={styles.checkoutInfobox}>
          <p className={styles.checkoutSubHeader}>subtotal:</p>
          <span className={styles.checkoutSubPrice}>
            {subTotalPrice.toFixed(2)}$
          </span>
        </div>
        <div className={styles.checkoutInfobox}>
          <p className={styles.checkoutSubHeader}>shipping:</p>
          <span className={styles.checkoutSubPrice}>{shippingCost.toFixed(2)} $</span>
        </div>
        <div className={styles.checkoutInfobox}>
          <p className={styles.checkoutSubHeader}>Tex:</p>
          <span className={styles.checkoutSubPrice}>{salesTax.toFixed(2)} $</span>
        </div>
        <div className={styles.checkoutInfobox}>
          <h3 className={styles.checkoutMainHeader}>total:</h3>
          <span className={styles.checkoutMainPrice}>
            {totalPrice.toFixed(2)}$
          </span>
        </div>
      </div>
    </div>
  );
}
