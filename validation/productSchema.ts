import * as z from "zod";


export const productSchema = z.object({
  productName: z.string().min(2, "Product name is required"),
  productDescription: z.string().min(5, "Description must be at least 5 characters"),
  isDiscount: z.boolean().default(false),  // ✅
  discountPercent: z.number().min(0).max(100).optional(),
  mainImage: z.object({
    url: z.string().url(),
    publicId: z.string(),
  }),
  subImages: z.array(
    z.object({
      url: z.string().url(),
      publicId: z.string(),
    })
  ),
  amazonLink: z.string().url().optional(),
  countofProduct: z.number().min(1, "Count must be at least 1"),
  price: z.number().min(1, "Price must be at least 1"),
  dimensions: z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0),
    weight: z.number().min(0),
  }),
});

export type TProductForm = z.infer<typeof productSchema>;