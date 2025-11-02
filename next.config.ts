import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-cdn.apitemplate.io",
      },
    ],
  },
};

export default nextConfig;
