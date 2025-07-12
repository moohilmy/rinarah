
export type TOrder = {
  stripePaymentIntentId: string;
  paymentStatus: string;
  paymentMethod: string;
  amountTotal: number;
  currency: string;
  customerEmail: string;

  shipping: {
    name: string;
    phone: string;
    address: {
      line1: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };

  shippo: {
    shipmentId: string;
    rateId: string;
    trackingNumber?: string;
    carrier?: string;
    serviceLevel?: string;
    labelUrl?: string;
  };

  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];

  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
};
