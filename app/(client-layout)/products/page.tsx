import { ProductCard } from "@/components";
import { TProductRes } from "@/types";
import styles from "./styles.module.css";
import { getAllProducts } from "@/utils/getProducts";
import Link from "next/link";

export default async function Products() {

  const productList: TProductRes[] = await getAllProducts();

  if (!productList || productList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[85vh] gap-4">
        <h1 className=" text-3xl font-bold">Products are not available right now</h1>
        <p>Please check back later.</p>
        <p className="text-gray-500">Thank you for your patience!</p>
        <Link href="/">Go back to home</Link>
      </div>
    );
  }
  return (
    <div className={`${styles.productsSection} wrapper-page`}>
      {productList.map((p) => (
        <ProductCard product={p} key={p._id} />
      ))}
    </div>
  );
}