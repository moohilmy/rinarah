"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import Image from "next/image";

const discountOptions = [50, 35, 25, 20, 15, 10, 5] as const;

const productSchema = z.object({
  productName: z.string().min(3, "Product name must be at least 3 chars"),
  productDescription: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  isDiscount: z.boolean().default(false).optional(),
  discountPercent: z
    .union([
      z.literal(5),
      z.literal(10),
      z.literal(15),
      z.literal(20),
      z.literal(25),
      z.literal(35),
      z.literal(50),
    ])
    .optional(),
  isProductSellInAmazon: z.boolean().default(false).optional(),
  amazonLink: z.string().url().optional(),
  mainImage: z.object({
    url: z.string().url(),
    publicID: z.string().nullable(),
  }),
  subImages: z.array(
    z.object({
      url: z.string().url(),
      publicID: z.string().nullable(),
    })
  ),
  countofProduct: z.coerce.number().min(20, "Count must be at least 20"),
  price: z.coerce.number().min(0.99, "Price must be at least 0.99"),
  dimensions: z.object({
    length: z.coerce.number().min(0),
    width: z.coerce.number().min(0),
    height: z.coerce.number().min(0),
    weight: z.coerce.number().min(0),
  }),
});

type TProductForm = z.infer<typeof productSchema>;

export default function CreateProductForm({
  adminID,
  token,
}: {
  adminID: string;
  token: string;
}) {
  const {
    register,
    setValue,
    watch,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isDiscount: false,
      mainImage: { url: "", publicID: null },
      subImages: [],
      isProductSellInAmazon: false,
      countofProduct: 20,
      price: 0.99,
    },
  });

  const { isDiscount, isProductSellInAmazon, mainImage, subImages } = watch();

  const onSubmit = async (data: TProductForm) => {
    const newProduct = {
      productName: data.productName,
      productDescription: data.productDescription,
      isDiscount: data.isDiscount,
      discountPercent: data.discountPercent,
      amazonLink: data.isProductSellInAmazon ? data.amazonLink : null,
      mainImage: data.mainImage,
      subImages: data.subImages,
      countofProduct: data.countofProduct,
      price: data.price,
      dimensions: data.dimensions,
    };

    try {
      await fetch(`/api/${adminID}/create-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `RLUX ${token}`,
        },
        body: JSON.stringify(newProduct),
      });
    } catch (error) {
      console.error("Create Product Error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full"
    >
      {/* Main Image */}
      <section className="flex flex-col gap-4">
        <h2 className="rinarah-checkout-title">Main Image</h2>
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{
            maxFiles: 1,
            maxFileSize: 5000000,
            multiple: false,
            resourceType: "image",
            clientAllowedFormats: ["jpg", "png", "jpeg"],
          }}
          onSuccess={(result: CloudinaryUploadWidgetResults) => {
            if (
              typeof result.info !== "object" ||
              !("secure_url" in result.info) ||
              !("public_id" in result.info)
            ) {
              return;
            }
            setValue("mainImage", {
              url: result.info.secure_url,
              publicID: result.info.public_id,
            });
          }}
        >
          {({ open }) => (
            <button type="button" className="rinarahBtn" onClick={() => open()}>
              Upload Main Image
            </button>
          )}
        </CldUploadWidget>
        {mainImage.publicID !== null && (
          <Image
            src={mainImage.url}
            alt="Main Product"
            width={128}
            height={128}
          />
        )}
      </section>

      {/* Sub Images */}
      <section className="flex flex-col gap-4">
        <h2 className="rinarah-checkout-title">Sub Images</h2>
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{
            maxFiles: 5,
            maxFileSize: 5000000,
            multiple: true,
            resourceType: "image",
            clientAllowedFormats: ["jpg", "png", "jpeg"],
          }}
          onSuccess={(result: CloudinaryUploadWidgetResults) => {
            if (
              typeof result.info !== "object" ||
              !("secure_url" in result.info) ||
              !("public_id" in result.info)
            ) {
              return;
            }
            const prevImages = getValues("subImages") || [];
            setValue("subImages", [
              ...prevImages,
              { url: result.info.secure_url, publicID: result.info.public_id },
            ]);
          }}
        >
          {({ open }) => (
            <button type="button" className="rinarahBtn" onClick={() => open()}>
              Upload Sub Images
            </button>
          )}
        </CldUploadWidget>
        {subImages?.length > 0 &&
          subImages.map((image, index) => (
            <Image
              key={index}
              src={image.url}
              alt={`Sub ${index + 1}`}
              width={128}
              height={128}
              className="w-32 h-32 object-cover rounded"
            />
          ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="rinarah-checkout-title">Product Info</h2>

        <div className="rinarah-checkout-box">
          <input
            id="productName"
            type="text"
            placeholder="Product Name"
            className="rinarah-checkout-input"
            {...register("productName")}
            disabled={isSubmitting}
          />
          <label htmlFor="productName" className="rinarah-checkout-label">
            Product Name
          </label>
          {errors.productName && (
            <span className="rinarah-error-message">
              {errors.productName.message}
            </span>
          )}
        </div>

        {/* Product Description */}
        <div className="rinarah-checkout-box">
          <textarea
            id="productDescription"
            placeholder="Product Description"
            className="rinarah-checkout-input"
            {...register("productDescription")}
            disabled={isSubmitting}
          />
          <label
            htmlFor="productDescription"
            className="rinarah-checkout-label"
          >
            Product Description
          </label>
          {errors.productDescription && (
            <span className="rinarah-error-message">
              {errors.productDescription.message}
            </span>
          )}
        </div>

        {/* Amazon Link */}
        <div className="flex gap-4">
          <input
            id="isProductSellInAmazon"
            type="checkbox"
            {...register("isProductSellInAmazon")}
            disabled={isSubmitting}
          />
          <label
            htmlFor="isProductSellInAmazon"
            className="text-2xl font-bold text-primary uppercase"
          >
            Sell on Amazon?
          </label>
        </div>
        {isProductSellInAmazon && (
          <div className="rinarah-checkout-box">
            <input
              id="amazonLink"
              type="url"
              placeholder="Amazon Link (optional)"
              className="rinarah-checkout-input"
              {...register("amazonLink")}
              disabled={isSubmitting}
            />
            <label htmlFor="amazonLink" className="rinarah-checkout-label">
              Amazon Link
            </label>
            {errors.amazonLink && (
              <span className="rinarah-error-message">
                {errors.amazonLink.message}
              </span>
            )}
          </div>
        )}
      </section>

      {/* Pricing */}
      <section className="flex flex-col gap-4">
        <h2 className="rinarah-checkout-title">Pricing</h2>
        <div className="rinarah-checkout-box">
          <input
            id="price"
            type="number"
            placeholder="Price"
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
            className="rinarah-checkout-input"
            {...register("price", { valueAsNumber: true })}
            disabled={isSubmitting}
          />
          <label htmlFor="price" className="rinarah-checkout-label">
            Price
          </label>
          {errors.price && (
            <span className="rinarah-error-message">
              {errors.price.message}
            </span>
          )}
        </div>

        <div className="flex gap-4">
          <input
            id="isDiscount"
            type="checkbox"
            {...register("isDiscount")}
            disabled={isSubmitting}
          />
          <label
            htmlFor="isDiscount"
            className="text-2xl font-bold text-primary uppercase"
          >
            Discount?
          </label>
        </div>

        {isDiscount && (
          <select
            {...register("discountPercent")}
            className="border p-2 rounded w-full"
            disabled={isSubmitting}
          >
            <option value="">اختر نسبة الخصم</option>
            {discountOptions.map((option) => (
              <option key={option} value={option}>
                {option}%
              </option>
            ))}
          </select>
        )}
      </section>

      {/* Stock */}
      <section className="flex flex-col gap-4">
        <h2 className="rinarah-checkout-title">Stock</h2>
        <div className="rinarah-checkout-box">
          <input
            id="countofProduct"
            type="number"
            placeholder="Count"
            min={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
            className="rinarah-checkout-input"
            {...register("countofProduct", { valueAsNumber: true })}
            disabled={isSubmitting}
          />
          <label htmlFor="countofProduct" className="rinarah-checkout-label">
            Count
          </label>
          {errors.countofProduct && (
            <span className="rinarah-error-message">
              {errors.countofProduct.message}
            </span>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="rinarah-checkout-title">Dimensions</h2>
        {(["length", "width", "height", "weight"] as const).map((dim) => (
          <div key={dim} className="rinarah-checkout-box">
            <input
              id={dim}
              min={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault();
                }
              }}
              type="number"
              placeholder={dim}
              className="rinarah-checkout-input"
              {...register(`dimensions.${dim}`, { valueAsNumber: true })}
              disabled={isSubmitting}
            />
            <label htmlFor={dim} className="rinarah-checkout-label">
              {dim.charAt(0).toUpperCase() + dim.slice(1)}
            </label>
            {errors.dimensions?.[dim] && (
              <span className="rinarah-error-message">
                {errors.dimensions[dim]?.message}
              </span>
            )}
          </div>
        ))}
      </section>

      <button
        type="submit"
        className="rinarahBtn"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}
