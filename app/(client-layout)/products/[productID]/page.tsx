import ADDToCart from "@/elements/ADDToCart/ADDToCart";
import { TProductRes } from "@/types";
import { discountCalculator, GetProductByID } from "@/utils";
import Link from "next/link";
import { FaAmazon } from "react-icons/fa";
import styles from "./styles.module.css";
export default async function Page({
  params,
}: {
  params: Promise<{ productID: string }>;
}) {
  const { productID } = await params;

  const product: TProductRes = await GetProductByID(productID);
  const {
    productDescription,
    price,
    productName,
    mainImage,
    discountPercent,
    _id,
    isDiscount,
    amazonLink,
    dimensions
  } = product;
  const discountPrice = discountCalculator(discountPercent, price);
  return (
    <section>
      <div className={styles.productInfo}>
        <h1 className={styles.productName}>{productName}</h1>
        <div className={styles.priceSection}>
          <span className={styles.priceText}>{isDiscount ? discountPrice : price}$</span>
          {isDiscount && <span className={styles.priceDiscounted}>{price.toFixed(2)}$</span>}
        </div>
      </div>
      <p className={styles.descriptionSection}>{productDescription}</p>
      <div className={styles.BtnsContainer}>
        <ADDToCart
          item={{
            id: _id,
            image:  mainImage?.url ?? "",
            name: productName,
            quantity: 1,
            price: isDiscount ? Number(discountPrice) : Number(price),
            dimensions

          }}
        />
        {amazonLink !== null && (
          <Link className={`amazonBtn`} href={`${amazonLink}`}>
            <FaAmazon /> amazon
          </Link>
        )}
      </div>
    </section>
  );
}
