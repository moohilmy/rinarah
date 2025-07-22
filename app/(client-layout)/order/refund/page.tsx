import { RefundButton } from "@/components";
import { TOrder } from "@/types";

import { checkOrderIsCorrect } from "@/utils";
export default async function CancelPromptPage({
  searchParams,
}: {
  searchParams: Promise<{ pi?: string }>;
}) {
  const { pi } = await searchParams;
  if (!pi) return <ErrorMessage message="Missing order reference." />;

  const order : TOrder = await checkOrderIsCorrect(pi);

  if (!order)
    return <ErrorMessage message="Order not found or already cancelled." />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Are you sure you want to cancel your order?
      </h1>
      <p className="text-gray-600 mb-6">
        If you wish to cancel and refund your order, click the button below.
      </p>
      <RefundButton pi={order.stripePaymentIntentId} />
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <p className="text-red-600 text-xl font-medium">{message}</p>
    </div>
  );
}
