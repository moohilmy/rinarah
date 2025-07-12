import React from "react";
import Image from "next/image";
import styles from "./style.module.css";
import Link from "next/link";
export default function GetProducts() {
  return (
    <section className={`${styles.getProductSection} parallax-section`}>
      <div className={styles.getProductContant}>
        <Image 
          src="/loofah.png"
          alt="Get Our Products"
          width={125}
          height={125}
        />
        <h1 className={`${styles.getProductHeader} header-section`}>Get Our Products</h1>
        <p className={`${styles.getProductText}`}>
          Experience the best with our premium products.
        </p>
        <Link href={'/products'} className={`rinarahBtn`}>
          Shop Now
        </Link>
      </div>
    </section>
  );
}
