import { ProuctImageBox } from "@/components";
import { TProductRes } from "@/types";
import { GetProductByID } from "@/utils";
import styles from "./styles.module.css";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productID: string }>;
}): Promise<Metadata> {
  const { productID } = await params;
  const product: TProductRes = await GetProductByID(productID);

  return {
    title: product.productName,
    description:
      product.productDescription?.slice(0, 150) || "View product details",
    openGraph: {
      title: product.productName,
      description: product.productDescription,
      images: [product.mainImage?.url || ""],
    },
  };
}

export default async function ProductIDLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ productID: string }>;
}>) {
  const { productID } = await params;
  const product: TProductRes = await GetProductByID(productID);

  return (
    <div className={`${styles.productLayout} wrapper-page`}>
      <div className={styles.productLeftSection}>
        <ProuctImageBox
          mainImage={product.mainImage}
          subImages={product.subImages}
          productName={product.productName}
        />
      </div>
      <div className={styles.layoutContent}>{children}</div>
    </div>
  );
}
