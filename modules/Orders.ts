import mongoose, { Schema, Document } from "mongoose";
import { TOrder } from "@/types";
import Joi from "joi";

export interface IOrderDocument extends Omit<TOrder, "_id">, Document {}

const OrderSchema = new Schema<IOrderDocument>(
  {
    stripePaymentIntentId: { type: String, required: true, unique: true },
    paymentStatus: String,
    paymentMethod: String,
    amountTotal: Number,
    subtotal: Number,
    tax: Number,
    currency: String,
    customerEmail: String,
    isEmailSent: { type: Boolean, default: false },
    shipping: {
      name: String,
      phone: String,
      shippingPrice: Number,
      address: {
        line1: String,
        city: String,
        state: String,
        zip: String,
        country: String,
      },
    },

    shippo: {
      transactionId: String,
      rateId: String,
      trackingNumber: String,
      trackingStatus: String,
      objectState: String,
      labelUrl: String,
      status: String,
      messages: [
        {
          source: String,
          code: String,
          text: String,
        },
      ],
    },

    items: [
      {
        id: String,
        name: String,
        quantity: Number,
        price: Number,
        _id: false,
      },
    ],

    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

export const validateOrder = (orderData: TOrder) => {
  const schema = Joi.object({
    stripePaymentIntentId: Joi.string().required(),
    paymentStatus: Joi.string().required(),
    paymentMethod: Joi.string().optional(),
    amountTotal: Joi.number().min(0).required(),
    tax: Joi.number().min(0).required(),
    subtotal: Joi.number().min(0).required(),
    currency: Joi.string().length(3).required(),
    customerEmail: Joi.string().email().required(),

    shipping: Joi.object({
      name: Joi.string().required(),
      phone: Joi.string().allow("", null),
      shippingPrice: Joi.number().required(),
      address: Joi.object({
        line1: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().allow("", null),
        zip: Joi.string().required(),
        country: Joi.string().required(),
      }).required(),
    }).required(),

    shippo: Joi.object({
      transactionId: Joi.string().required(),
      rateId: Joi.string().required(),
      trackingNumber: Joi.string().optional().allow("", null),
      trackingStatus: Joi.string().required(),
      objectState: Joi.string().required(),
      labelUrl: Joi.string().uri().optional().allow("", null),
      status: Joi.string().required(),
      messages: Joi.array()
        .items(
          Joi.object({
            source: Joi.string().optional(),
            code: Joi.string().optional(),
            text: Joi.string().required(),
          })
        )
        .optional(),
    }).required(),

    items: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().required(),
          name: Joi.string().required(),
          quantity: Joi.number().min(1).max(9).required(),
          price: Joi.number().min(0.01).required(),
        })
      )
      .min(1)
      .required(),

    status: Joi.string().default("pending").required(),
  });

  return schema.validate(orderData, { abortEarly: false });
};

const Order =
  mongoose.models.Order || mongoose.model<IOrderDocument>("Order", OrderSchema);

export { Order };
