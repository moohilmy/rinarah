import type { NextConfig } from "next";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const nextConfig: NextConfig = {
  compress: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: `/${cloudName}/image/upload/**`,
      },
    ],
    minimumCacheTTL: 86400,
  },

  experimental: {
    optimizePackageImports: [
      "animejs",
      "zod",
      "react-icons",
      "react-hook-form",
    ],
  },
};

export default nextConfig;
