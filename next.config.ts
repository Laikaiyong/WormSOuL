import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "img-cdn.magiceden.dev"
      },
    ],
  },
};

export default nextConfig;
