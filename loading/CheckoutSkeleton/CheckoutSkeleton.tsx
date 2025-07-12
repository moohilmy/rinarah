import React from "react";

export default function CheckoutSkeleton({ styles }: { styles : { [key: string]: string }}) {
  return (
    <>
      <div className={styles.iteamsInCart}>
        <div className={styles.itemCart}>
          <div className=" relative">
            <div className={styles.itemCartImageSkeleton}></div>
            <span className="popupNumSkeleton"></span>
          </div>
          <div className={styles.itemDetails}>
            <span className={styles.bigItemsSkeleton}></span>
            <span className={styles.smallItemsSkeleton}></span>
          </div>
        </div>
      </div>
      <div className={styles.checkoutInfo}>
        <div className={styles.checkoutInfobox}>
          <span className={styles.bigItemsSkeleton}></span>
          <span className={styles.smallItemsSkeleton}></span>
        </div>
        <div className={styles.checkoutInfobox}>
          <span className={styles.bigItemsSkeleton}></span>
          <span className={styles.smallItemsSkeleton}></span>
        </div>
        <div className={styles.checkoutInfobox}>
          <span className={styles.bigItemsSkeleton}></span>
          <span className={styles.smallItemsSkeleton}></span>
        </div>
      </div>
    </>
  );
}
