import { ProductCard } from "@/components";
import { TProductRes } from "@/types";
import styles from "./styles.module.css";
import { getAllProducts } from "@/utils";

export default async function Products() {
  const notworkRightNow = false;
  if (!notworkRightNow) return;
  const productList: TProductRes[] = await getAllProducts();

  return (
    <div className={`${styles.productsSection} wrapper-page`}>
      {productList.map((p) => (
        <ProductCard product={p} key={p._id} />
      ))}
    </div>
  );
}
