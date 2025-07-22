import { Product } from "@/modules/Product";
import { NextRequest, NextResponse } from "next/server";
import { Order, validateOrder } from "@/modules/Orders";
import { TOrder } from "@/types";
import mongoose from "mongoose";
import Stripe from "stripe";

import { cancelShippoLabel } from "@/lib/shippo";
const stripe = new Stripe(process.env.SECRET_API_KEY as string, {
  apiVersion: "2025-04-30.basil",
});
export const createOrder = async (req: NextRequest) => {
  const session = await mongoose.startSession();

  try {
    const body: TOrder = await req.json();
    const { error } = validateOrder(body);
    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    const {
      items,
      shipping,
      shippo,
      status,
      stripePaymentIntentId,
      paymentMethod,
      paymentStatus,
      amountTotal,
      currency,
      customerEmail,
    } = body;

    const existingOrder = await Order.findOne({ stripePaymentIntentId });
    if (existingOrder) {
      return NextResponse.json({
        message: "An order with this payment intent has already been created.",
      });
    }

    session.startTransaction();

    for (const i of items) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: i.id,
          countofProduct: { $gte: i.quantity },
        },
        {
          $inc: { countofProduct: -i.quantity },
        },
        { new: true, session }
      );

      if (!updatedProduct) {
        await session.abortTransaction();
        return NextResponse.json(
          { message: `Product with id ${i.id} is out of stock or not found` },
          { status: 403 }
        );
      }
    }

    const newOrder = await Order.create(
      [
        {
          items,
          shipping,
          shippo,
          status,
          stripePaymentIntentId,
          paymentMethod,
          paymentStatus,
          amountTotal,
          currency,
          customerEmail,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return NextResponse.json(
      { newOrder, message: "Order created successfully" },
      { status: 201 }
    );
  } catch (error) {
    await session.abortTransaction();
    console.error("[Order Error]", error);
    return NextResponse.json(
      { message: `Internal Server Error ${error}` },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
};

export const checkOrderInDB = async (stripeID: string) => {
  try {
    if (!stripeID) {
      return NextResponse.json(
        { message: "Missing stripePaymentIntentId" },
        { status: 400 }
      );
    }

    const order = await Order.findOne({
      stripePaymentIntentId: stripeID,
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { order, message: "Order found" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Order Error]", error);
    return NextResponse.json(
      { message: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
};

export const cancellOrder = async (stripeID: string) => {
  try {
    if (!stripeID) {
      return NextResponse.json(
        { message: "Missing stripePaymentIntentId" },
        { status: 400 }
      );
    }

    const order  = await Order.findOne({ stripePaymentIntentId: stripeID });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    if (order.status === "shipped" || order.status === "delivered") {
      return NextResponse.json(
        {
          message:
            "This order has already been shipped and cannot be cancelled.",
        },
        { status: 403 }
      );
    }

    if (order.shippo?.transactionId) {
      try {
        await cancelShippoLabel(order.shippo.transactionId);
      } catch (err) {
        console.warn("Shippo cancel failed:", err);
      }
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(stripeID);

    if (paymentIntent.status === "succeeded") {
      await stripe.refunds.create({ payment_intent: stripeID });
    } else if (
      paymentIntent.status === "requires_capture" ||
      paymentIntent.status === "requires_payment_method" ||
      paymentIntent.status === "processing"
    ) {
      await stripe.paymentIntents.cancel(stripeID);
    }

    await Order.findByIdAndDelete(order._id);

    return NextResponse.json(
      
      { ok : true , message: "Order cancelled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Order Cancel Error]", error);
    return NextResponse.json(
      { message: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
};
