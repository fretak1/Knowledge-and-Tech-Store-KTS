import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is now a top-level property in Next.js 15.3+
  turbopack: {
    // You can add resolveAlias or rules here if needed later
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

  /* Removed the webpack block entirely. 
     Next.js will now use Turbopack by default without 
     throwing the "migration needed" error.
  */
};

export default nextConfig;