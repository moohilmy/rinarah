import { CartType } from "./CartType";
import { ShippoResponse } from "./shippingType";
export type TItem = Pick<CartType, "id" | "name" | "price" | "quantity">;

export type TOrder = {
  stripePaymentIntentId: string;
  paymentStatus: string;
  paymentMethod: string;
  amountTotal: number;
  currency: string;
  customerEmail: string;
  isEmailSent?: boolean;
  subtotal: number,
  tax: number,
  shipping: {
    name: string;
    phone: string;
    shippingPrice: number;
    address: {
      line1: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };

  shippo: ShippoResponse;
  createdAt?: string;
  items: TItem[];

  status:
    | "pending"
    | "paid"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "succeeded";
};
