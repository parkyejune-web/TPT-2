import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip static generation to avoid useSearchParams errors
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
