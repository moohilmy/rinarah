import { Product, validateCreateProduct } from "@/modules/Product";
import { NextRequest, NextResponse } from "next/server";

import { validateObjectId } from "@/middleware/validateObjectId";
import { Admin } from "@/modules/Admin";
import { verifyAdmin } from "@/middleware/verifyToken";

export const CreateProduct = async (
  req: NextRequest,
  context: { params: Promise<{ AdminID: string }> }
) => {
  try {
    const auth = await verifyAdmin(req);
    if (!auth.valid) {
      return NextResponse.json({ message: auth.message }, { status: 403 });
    }
    const { AdminID } = await context.params;
    const validationResponse = validateObjectId(AdminID);
    if (validationResponse) return validationResponse;
    const body = await req.json();

    const { error } = validateCreateProduct(body);
    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    const product = await Product.create({
      productName: body.productName,
      productDescription: body.productDescription,
      mainImage: body.mainImage,
      subImages: body.subImages ?? [
        {
          url: "https://res.cloudinary.com/deolyu2lp/image/upload/v1747931163/default-img.png",
          publicID: null,
        },
        {
          url: "https://res.cloudinary.com/deolyu2lp/image/upload/v1747931163/default-img.png",
          publicID: null,
        },
        {
          url: "https://res.cloudinary.com/deolyu2lp/image/upload/v1747931163/default-img.png",
          publicID: null,
        },
        {
          url: "https://res.cloudinary.com/deolyu2lp/image/upload/v1747931163/default-img.png",
          publicID: null,
        },
      ],
      whoCreated: AdminID,
      countofProduct: body.countofProduct,
      dimensions: body.dimensions,
      price: body.price,
      discountPercent: body.discountPercent ?? 0,
      isDiscount: body.isDiscount ?? false,
      isInStock: true,
      isApproved: false,
    });

    return NextResponse.json(product, {
      status: 201,
    });
  } catch (err) {
    console.error("[CreateProduct Error]", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const getALlProductsApproved = async () => {
  try {
    const products = await Product.find({ isApproved: true }).select("-whoCreated");
    if (!products) {
      return NextResponse.json(
        { message: "Products not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error("[GETPRODUCTS Error]", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const getProductbyID = async (
  req: NextRequest,
  context: { params: Promise<{ productID: string }> }
) => {
  try {
    const { productID } = await context.params;
    const validationResponse = validateObjectId(productID);
    if (validationResponse) return validationResponse;
    const product = await Product.findById(productID).select("-whoCreated");
    return NextResponse.json(product, {
      status: 200,
    });
  } catch (err) {
    console.error("[GETPRODUCT Error]", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const ApproveProduct = async (
  req: NextRequest,
  context: { params: { AdminID: string; productID: string } }
) => {
  try {
    const validationAdminResponse = validateObjectId(context.params.AdminID);
    const validationProductResponse = validateObjectId(
      context.params.productID
    );
    if (validationAdminResponse) return validationAdminResponse;
    if (validationProductResponse) return validationProductResponse;
    const product = await Product.findById(context.params.productID);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    const admin = await Admin.findById(context.params.AdminID);
    if (admin?._id === context.params.AdminID) {
      return NextResponse.json(
        {
          message:
            "Access denied. Your account must be approved by another admin.",
        },
        { status: 403 }
      );
    }
    product.isApproved = true;
    await product.save();
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("[Approve Product Error]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
