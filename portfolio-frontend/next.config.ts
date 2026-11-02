// next.config.ts
import type { NextConfig } from "next";

const next = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: { optimizePackageImports: ["lucide-react", "framer-motion"] },
  compress: true,
  poweredByHeader: false,
} satisfies NextConfig;

export default next;