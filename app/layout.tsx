import "./globals.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import type { Metadata } from "next";
import { logoFont, mainFont, textFont } from "./fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://rinarah.com"),
  title: "RINARAH",
  description:
    "Inspired by natural beauty — RINARAH is a natural skincare brand offering eco-friendly products like loofahs that elevate your self-care rituals through gentle exfoliation, deep cleansing, and mindful beauty rooted in nature.",
  keywords: [
    "RINARAH",
    "natural beauty",
    "organic",
    "egyptian loofahs",
    "loofah",
    "skincare",
    "natural products",
    "natural skincare",
    "eco-friendly",
    "loofahs",
    "self-care",
    "exfoliation",
    "deep cleansing",
    "mindful beauty",
  ],
  openGraph: {
    title: "RINARAH",
    description:
      "Inspired by natural beauty — RINARAH is a natural skincare brand offering eco-friendly products like loofahs that elevate your self-care rituals through gentle exfoliation, deep cleansing, and mindful beauty rooted in nature.",
    url: "https://rinarah.com",
    siteName: "RINARAH",
    images: [
      {
        url: "/logo-landscape.png",
        width: 1200,
        height: 630,
        alt: "RINARAH - Natural Skincare Brand",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RINARAH",
    description:
      "Inspired by natural beauty — RINARAH is a natural skincare brand offering eco-friendly products like loofahs that elevate your self-care rituals through gentle exfoliation, deep cleansing, and mindful beauty rooted in nature.",
    images: ["/logo-landscape.png"],
  },
  robots: {
  index: true,
  follow: true,
  nocache: false,
},

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mainFont.className} ${logoFont.variable} ${textFont.variable} antialiased`}
      >
        <ToastContainer />

        {children}
      </body>
    </html>
  );
}
