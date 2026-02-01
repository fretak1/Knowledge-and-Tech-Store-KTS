import type { NextConfig } from "next";

// Use type assertion to allow unknown experimental properties
const nextConfig: NextConfig & { experimental?: any } = {
  experimental: {
    externalDir: true, // keep if needed
    turbo: false,       // force Webpack build on Vercel
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

  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
