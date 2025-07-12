import Link from "next/link";
import styles from "./styles.module.css";
import Image from "next/image";
import { TProductRes } from "@/types";
import { discountCalculator } from "@/utils";
import { FaAmazon } from "react-icons/fa";
export default function ProductCard({ product }: { product: TProductRes }) {
  const { discountPercent,isDiscount, price, mainImage, productName, _id, amazonLink } =
    product;
  const discountprice = discountCalculator(discountPercent, price);

  return (
    <div className={styles.productCard}>
      <div className={styles.productCardImage}>
        <Image
          src={`${mainImage.url}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.productCardImageSrc}
          alt={`${productName}-image`}
        />
      </div>
      <div className={styles.productInfo}>
        <div className={styles.mainInfo}>
          <h1 className={styles.productName}>{productName}</h1>
          <div className={styles.priceSection}>
            <span className={styles.mainPrice}>{isDiscount ? discountprice : price}$</span>
            {isDiscount && <span className={styles.subPrice}>{price.toFixed(2)}$</span>}
          </div>
        </div>
        <div className={`${styles.shoppingBtns} mt-0`}>
          <Link href={`/products/${_id}`} className={`rinarahBtn ${styles.buyNow}`}>buy now</Link>
          {amazonLink !== null && <Link className={` amazonBtn`} href={`${amazonLink}`}><FaAmazon /> amazon</Link>}
        </div>
      </div>
      <Link href={`/products/${_id}`} className="rinaralink" />

    </div>
  );
}
