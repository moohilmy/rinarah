import { Product } from "@/modules/Product";
import { NextRequest, NextResponse } from "next/server";
import { Order, validateOrder } from "@/modules/Orders";
export const createOrder = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { productId, count } = body;

    const order = new Order({
      productId,
      count,
    });

    const { error } = validateOrder(order);
    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    await order.save();
    return NextResponse.json(
      { message: "Order created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Order Error]", error);
    return NextResponse.json(
      { message: `Internal Server Error ${error} ` },
      { status: 500 }
    );
  }
};
export const orederCountProductById = async (
  req: NextRequest,
  context: { params: Promise<{ productId: string }> }
) => {
  try {
    const { productId } = await context.params;
    const { count } = await req.json();
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    if (product.countofProduct < count) {
      return NextResponse.json({ message: "out of stock" }, { status: 400 });
    }
    product.countofProduct -= count;
    await product.save();
    return NextResponse.json(
      { message: "Product count updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Order Error]", error);
    return NextResponse.json(
      { message: `Internal Server Error ${error} ` },
      { status: 500 }
    );
  }
};
