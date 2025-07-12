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
