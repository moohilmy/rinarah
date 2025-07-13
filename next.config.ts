import type { NextConfig } from "next";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

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
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: `/upload/**`,
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
