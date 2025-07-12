export  interface ICheckoutForm {
  email: string;
  country: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | number;
  address: string;
  zipCode: number;
  state: string;
  city: string;
  shippingInfo: {
    objectId: string;
    rate: number;
  };
}