import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Organic Products | RINARA",
  description:
    "Discover a curated selection of premium organic products at RINARA. From natural loofahs to eco-friendly skincare essentials, our collection is crafted to promote a healthier lifestyle with ingredients inspired by nature.",
  openGraph: {
    title: "Shop Organic Products | RINARA",
    description:
      "Explore RINARA’s organic collection — natural loofahs, clean skincare, and sustainable products designed for a better you and a greener planet.",
  },
};

export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const notworkRightNow = false; 
  if (!notworkRightNow) {
    return (
      <div className="flex flex-col items-center justify-center h-[85vh] gap-4">
        <h1 className=" text-3xl font-bold">Products are not available right now</h1>
        <p>Please check back later.</p>
        <p className="text-gray-500">Thank you for your patience!</p>
        <Link href="/">Go back to home</Link>
      </div>
    );
  }
  return children;
}
