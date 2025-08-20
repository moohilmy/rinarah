import { IAdminDocument } from "@/modules/Admin";
type TImage = {
  url: string;
  publicID: string;
};
export const discountOptions = [50, 35, 25, 20, 15, 10, 5, 0] as const;
export type TDiscountPercent = (typeof discountOptions)[number];
type TProduct = {
  productName: string;
  productDescription: string;
  isDiscount: boolean;
  discountPercent: TDiscountPercent;
  mainImage: TImage;
  subImages: TImage[];
  amazonLink?: string | null;
  whoCreated: IAdminDocument["_id"] | string;
  countofProduct: number;
  price: number;
  isInStock: boolean;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  isApproved: boolean;
};
interface TProductRes extends TProduct {
  _id: string;
}
export { type TProduct, type TProductRes, type TImage };
