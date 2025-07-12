import mongoose, { Document, model, models, Schema } from "mongoose";
import { TProduct } from "@/types";
import Joi from "joi";

interface IProductDocument extends TProduct, Document {}

const ProductSchema: Schema = new Schema<IProductDocument>(
  {
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
    mainImage: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/deolyu2lp/image/upload/v1747931163/default-img.png",
      },
      publicID: { type: String, default: null },
    },
    subImages: {
      type: [
        {
          url: {
            type: String,
            default:
              "https://res.cloudinary.com/deolyu2lp/image/upload/v1747931163/default-img.png",
          },
          publicID: { type: String, default: null },
        },
      ],
      default: [],
    },
    amazonLink: { type: String, default: null },
    whoCreated: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
      required: true,
    },
    countofProduct: { type: Number, required: true, min: 20 },
    price: { type: Number, required: true, min: 0.99 },
    discountPercent: {
      type: Number,
      enum: [50, 35, 25, 20, 15, 10, 5, 0],
      required: false,
    },
    dimensions: {
      type: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        weight: { type: Number, required: true },
      },
      required: true,
    },
    isDiscount: { type: Boolean, default: false },
    isInStock: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const validateCreateProduct = (obj: TProduct) => {
  // const photoSchema = Joi.object({
  //   url: Joi.string().uri().required(),
  //   publicID: Joi.string().allow(null).optional(),
  // });

  const schema = Joi.object({
    productName: Joi.string().min(3).max(50).required(),
    productDescription: Joi.string().min(10).required(),
    amazonLink: Joi.string().uri().allow(null),
    countofProduct: Joi.number().min(20).required(),
    price: Joi.number().min(0.99).required(),
    // mainImage: photoSchema.required(),
    // subImages: Joi.array().items(photoSchema).min(0).optional(),
    discountPercent: Joi.number().valid(0, 5, 10, 15, 20, 25, 35, 50).optional(),
    dimensions: Joi.object({
      length: Joi.number().required(),
      width: Joi.number().required(),
      height: Joi.number().required(),
      weight: Joi.number().required(),
    }).required(),
    isDiscount: Joi.boolean().default(false),
    isInStock: Joi.boolean().default(true),
    isApproved: Joi.boolean().default(false),
  });

  return schema.validate(obj);
};

const Product =
  models.Products || model<IProductDocument>("Products", ProductSchema);

export { validateCreateProduct, Product };
export type { IProductDocument };
