import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Organic Products | RINARAH",
  description:
    "Discover a curated selection of premium organic products at RINARAH. From natural loofahs to eco-friendly skincare essentials, our collection is crafted to promote a healthier lifestyle with ingredients inspired by nature.",
  openGraph: {
    title: "Shop Organic Products | RINARAH ",
    description:
      "Explore RINARAH’s organic collection — natural loofahs, clean skincare, and sustainable products designed for a better you and a greener planet.",
  },
};

export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
