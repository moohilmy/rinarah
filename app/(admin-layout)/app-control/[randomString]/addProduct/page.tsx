"use client";

import { discountOptions, TProduct } from "@/types";
import Image from "next/image";
import { useEffect, useState, ChangeEvent } from "react";
import { useForm, SubmitHandler, UseFormRegisterReturn } from "react-hook-form";

type TextInputProps = {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  error?: { message?: string };
  register: UseFormRegisterReturn;
};

const Textinput = ({
  id,
  type = "text",
  placeholder,
  error,
  label,
  register,
}: TextInputProps) => {
  return (
    <div className="rinarah-checkout-box">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={id}
        className="rinarah-checkout-input"
        {...register}
      />
      <label htmlFor={id} className="rinarah-checkout-label">
        {label}
      </label>
      {error && <span className="rinarah-error-message">{error.message}</span>}
    </div>
  );
};

export default function Page() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<TProduct>();

  const [hydrated, setHydrated] = useState(false);
  const [mainImage, setMainImage] = useState<string | null>(null);

  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setMainImage(imageUrl);
    }
  };
  const [subImages, setSubImages] = useState<string[]>([]);

  const handleSubImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const imageUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setSubImages(imageUrls);
    }
  };
  useEffect(() => setHydrated(true), []);
  const isDiscountSelected = watch("isDiscount");

  const onSubmit: SubmitHandler<TProduct> = async (data) => {
    console.log(data);
  };

  if (!hydrated) return;

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="rinarah-checkout-title">Add New Product</h2>
        <div className="space-y-4 flex justify-center flex-col items-center">
          {mainImage && (
            <div className="mt-4">
              <Image
                height={200}
                width={200}
                src={mainImage}
                alt="Main Preview"
                className="max-w-xs rounded-xl border border-gray-200 shadow"
              />
            </div>
          )}
          <label
            htmlFor="mainImage"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Main Image
          </label>

          <div className="relative w-fit">
            <input
              type="file"
              id="mainImage"
              accept="image/*"
              onChange={handleMainImageChange}
              className='rinarahBtn'
            />
          </div>
        </div>

        <div className="space-y-4 flex justify-center flex-col items-center">
          {subImages.length > 0 && (
            <div className="flex flex-row flex-wrap gap-3 items-center justify-center">
              {subImages.map((src, index) => (
                <Image
                  height={200}
                  width={200}
                  key={index}
                  src={src}
                  alt={`Sub Image ${index + 1}`}
                  className="max-w-xs rounded-xl border border-gray-200 shadow"
                />
              ))}
            </div>
          )}
          <label
            htmlFor="subImages"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Sub Images
          </label>

          <input
            type="file"
            id="subImages"
            name="subImages"
            accept="image/*"
            multiple
            onChange={handleSubImagesChange}
            className="rinarahBtn "
          />
        </div>

        <Textinput
          id="product-name"
          label="Product Name"
          register={register("productName", { required: "Required" })}
          error={errors.productName}
          placeholder="Product Name"
        />

        <div className="rinarah-checkout-box">
          <textarea
            id="productDescription"
            placeholder="Product Description"
            className="rinarah-checkout-input"
            {...register("productDescription")}
          />
          <label
            htmlFor="productDescription"
            className="rinarah-checkout-label"
          >
            Product Description
          </label>
        </div>

        <Textinput
          id="count-of-product"
          label="Count Of Product"
          type="number"
          register={register("countofProduct", { valueAsNumber: true })}
          error={errors.countofProduct}
          placeholder="0"
        />

        <Textinput
          id="price"
          label="Price"
          type="number"
          register={register("price", { valueAsNumber: true })}
          error={errors.price}
          placeholder="Enter price"
        />

        {/* isDiscount */}
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isDiscount" {...register("isDiscount")} />
          <label htmlFor="isDiscount">Has Discount?</label>
        </div>

        {/* discountPercent */}
        {isDiscountSelected && (
          <div className="rinarah-checkout-box">
            <select
              {...register("discountPercent")}
              className="rinarah-checkout-input"
            >
              {discountOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}%
                </option>
              ))}
            </select>
            <label className="rinarah-checkout-label">Discount Percent</label>
          </div>
        )}

        {/* Dimensions */}
        <h3 className="font-semibold">Dimensions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Textinput
            id="length"
            label="Length"
            type="number"
            register={register("dimensions.length", { valueAsNumber: true })}
            error={errors.dimensions?.length}
          />
          <Textinput
            id="width"
            label="Width"
            type="number"
            register={register("dimensions.width", { valueAsNumber: true })}
            error={errors.dimensions?.width}
          />
          <Textinput
            id="height"
            label="Height"
            type="number"
            register={register("dimensions.height", { valueAsNumber: true })}
            error={errors.dimensions?.height}
          />
          <Textinput
            id="weight"
            label="Weight"
            type="number"
            register={register("dimensions.weight", { valueAsNumber: true })}
            error={errors.dimensions?.weight}
          />
        </div>

        {/* amazonLink */}
        <Textinput
          id="amazonLink"
          label="Amazon Link"
          register={register("amazonLink")}
          error={errors.amazonLink}
          placeholder="https://..."
        />

        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          Submit Product
        </button>
      </form>
    </div>
  );
}
