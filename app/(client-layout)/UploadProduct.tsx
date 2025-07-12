"use client";
import React, { useState } from "react";

export default function UploadProduct() {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [subImages, setSubImages] = useState<File[]>([]);
  const [productName, setProductName] = useState("");

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "rinarah");
    formData.append("folder", "products");
    console.log("uploading file...", file);

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/deolyu2lp/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const error = await res.text();
        console.error("Cloudinary Error:", error);
        return null;
      }

      const data = await res.json();
      console.log("Uploaded to Cloudinary:", data);

      return { url: data.secure_url, publicID: data.public_id };
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!mainImage || !productName) return;

    const mainImageUploaded = await uploadToCloudinary(mainImage);
    const subImagesUploaded = await Promise.all(
      subImages.map(uploadToCloudinary)
    );

    const body = {
      productName,
      productDescription: "وصف المنتج",
      countofProduct: 50,
      price: 19.99,
      Pricediscount: 14.99,
      isDiscount: true,
      mainImage: mainImageUploaded,
      subImages: subImagesUploaded,
    };

    const adminId = "682ca339cf3c90c79fb56964";

    const res = await fetch(`/api/admin/${adminId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    console.log(result);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="اسم المنتج"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <br />
      <input
        type="file"
        onChange={(e) => setMainImage(e.target.files?.[0] || null)}
      />
      <br />
      <input
        type="file"
        multiple
        onChange={(e) => setSubImages(Array.from(e.target.files || []))}
      />
      <br />
      <button onClick={handleSubmit}>رفع المنتج</button>
    </div>
  );
}
