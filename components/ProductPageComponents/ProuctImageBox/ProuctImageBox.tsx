"use client";

import { TImage } from "@/types";
import Image from "next/image";
import { useState } from "react";

import styles from "./styles.module.css";
export default function ProuctImageBox({
  mainImage,
  subImages,
  productName,
}: {
  mainImage: TImage;
  subImages: TImage[];
  productName: string;
}) {
  const [defaultImage, setDefaultImage] = useState<string>(mainImage.url);

  return (
    <div className={styles.imageSectionSelector}>
      <ul className={styles.imageList}>
        <li
          className={styles.imageItem}
          onClick={() => {
            setDefaultImage(mainImage.url);
          }}
        >
          <Image
            src={mainImage.url}
            alt={`${productName}-image`}
            style={{
              objectFit: "cover",
            }}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </li>
        {subImages.map((image, index) => (
          <li
            key={index}
            className={styles.imageItem}
            onClick={() => {
              setDefaultImage(image.url);
            }}
          >
            <Image
              src={image.url}
              alt={`${productName}-image number ${index + 1}`}
              style={{
                objectFit: "cover",
              }}
              fill
            />
          </li>
        ))}
      </ul>
      <div className={styles.imageSeleced}>
        <Image
          src={defaultImage}
          alt={`${productName}-image`}
          fill
          style={{
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
}
