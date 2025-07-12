import mongoose, { Schema, Document } from "mongoose";
import { TOrder } from "@/types";
import Joi from "joi";

export interface IOrderDocument extends TOrder, Document {}

const OrderSchema = new Schema<IOrderDocument>(
  {
    stripePaymentIntentId: { type: String, required: true, unique: true },
    paymentStatus: String,
    paymentMethod: String,
    amountTotal: Number,
    currency: String,
    customerEmail: String,
    shipping: {
      name: String,
      phone: String,
      address: {
        line1: String,
        city: String,
        state: String,
        zip: String,
        country: String,
      },
    },
    shippo: {
      shipmentId: String,
      rateId: String,
      trackingNumber: String,
      carrier: String,
      serviceLevel: String,
      labelUrl: String,
    },
    items: [
      {
        productId: String,
        productName: String,
        quantity: Number,
        unitPrice: Number,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const validateOrder = (orderData: TOrder) => {
  const schema = Joi.object({
    stripePaymentIntentId: Joi.string().required(),
    customerEmail: Joi.string().email().required(),
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().required(),
          productName: Joi.string().required(),
          quantity: Joi.number().min(1).max(9).required(),
          unitPrice: Joi.number().min(0.01).required(),
          totalPrice: Joi.number().min(0.01).required(),
        })
      )
      .min(1)
      .required(),

    amountTotal: Joi.number().min(0).required(),
    currency: Joi.string().length(3).required(),
    status: Joi.string()
      .valid("pending", "paid", "failed", "shipped", "delivered", "cancelled")
      .default("pending")
      .required(),

    paymentMethod: Joi.string().required(),

    shipping: Joi.object({
      name: Joi.string().required(),
      phone: Joi.string().allow("", null),
      address: Joi.object({
        line1: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().allow("", null),
        country: Joi.string().required(),
        postalCode: Joi.string().required(),
      }).required(),
    }).optional(),

    paidAt: Joi.date().optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
  });

  return schema.validate(orderData, { abortEarly: false });
};

const Order =
  mongoose.models.Order || mongoose.model<IOrderDocument>("Order", OrderSchema);

export { Order };
