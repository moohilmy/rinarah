import { IAdminDocument } from "@/modules/Admin";
type TImage = {
    url: string;
    publicID: string;
  }
type TProduct = {
  productName: string;
  productDescription: string;
  mainImage: TImage;
  subImages: TImage[];
  amazonLink:string;
  whoCreated: IAdminDocument["_id"];
  countofProduct: number;
  price: number;
  discountPercent:   50 | 35  | 25 | 20 | 15 | 10 | 5 | 0;
  isDiscount: boolean;
  isInStock: boolean;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  isApproved: boolean;
};
interface TProductRes extends  TProduct  {_id:string}
export { type TProduct , type TProductRes , type TImage};
