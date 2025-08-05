import { Order } from "@/modules/Orders"; // حسب مكان موديلك
import { TOrder } from "@/types";

export const getOrderByPaymentIntentId = async (
  paymentIntentId: string
): Promise<TOrder | null> => {
  const order = await Order.findOne({ stripePaymentIntentId: paymentIntentId }).lean();
  return order as TOrder | null;
};
