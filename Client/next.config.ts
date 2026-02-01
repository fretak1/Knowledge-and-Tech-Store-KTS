import type { NextConfig } from "next";

const nextConfig: any = { // Using 'any' here is the fastest way to bypass the TS error
  experimental: {
    externalDir: true,
    turbopack: {}, // Try 'turbopack' instead of 'turbo'
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // If you aren't doing anything special here, 
  // deleting this block is the best way to stop the error.
  webpack: (config: any) => {
    return config;
  },
};

export default nextConfig;