
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: 'RINARA - Checkout',
  description: 'Checkout for RINARA'
}

export default async function CheckOutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <>
      {children}
    </>
  );
}
