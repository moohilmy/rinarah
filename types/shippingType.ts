export type TShippingInfo = {
  name: string;
  phone: string | number;
  street1: string;
  zip: string | number;
  city: string;
  state: string;
  country: string;
  email: string;
};
export type ShippingRate = {
  provider: string;
  service: string;
  amount: string;
  currency: string;
  estimated_days: number | null;
};
export type TParcel = {
  length: number;
  width: number;
  height: number;
  weight: number;
  distance_unit: "in";
  mass_unit: "oz";
};

export type ShippingRateInfo = {
  attributes: string[];
  object_id: string;
  provider: string;
  servicelevel: {
    name: string;
  };
  amount: string;
  currency: string;
  estimated_days: number;
  duration_terms: string;
};
export type ShippoResponse = {
  transactionId: string; 
  rateId: string; 
  trackingNumber: string;
  trackingStatus: string; 
  labelUrl: string | null; 
  status: string; 
  objectState: "VALID" | "INVALID" | string; 

  messages: {
    source?: string;
    code?: string;
    text: string;
  }[];
}
export type TAddress = Omit<TShippingInfo, 'email' | 'phone' | 'name'>
