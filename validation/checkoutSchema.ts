import { z } from "zod";
import { isZipCodeInState } from "@/utils/isZipCodeInState";


export const checkoutSchema = z
  .object({
    email: z.string().email(),
    country: z.string().min(2),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phoneNumber: z
      .string()
      .min(5, { message: "Enter valid phone number" })
      .regex(/^\d+$/, "Phone number must be digits only"),
    address: z.string().min(5, { message: "Enter valid address" }),
    state: z.string().min(2),
    zipCode: z.string().min(5, "ZIP Code is required"),
    city: z.string().min(1),
    shippingInfo: z.object({
      objectId: z.string().min(3, {message: "Please select a shipping method"}),
      rate: z.number(),
    }),
  })
  .refine(
    (data) => isZipCodeInState(data.zipCode, data.state),
    {
      path: ["zipCode"],
      message: "ZIP code does not match selected state",
    }
  );


export type ICheckoutForm = z.infer<typeof checkoutSchema>;
