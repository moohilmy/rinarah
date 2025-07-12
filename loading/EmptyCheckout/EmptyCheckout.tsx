import Link from "next/link";
import { IoBagCheckOutline } from "react-icons/io5";

export default function EmptyCheckout() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 transition-all h-[calc(100vh-5rem)] md:h-[calc(100vh-110px)]">
      <IoBagCheckOutline className="text-5xl mb-4 text-primary" />
      <p className="text-lg font-semibold">Your checkout is currently empty.</p>
      <p className="text-sm mt-2">Add some items to your cart to get started!</p>
      <Link href={'/products'} className="rinarahBtn">shop now</Link>
    </div>
  );
}
