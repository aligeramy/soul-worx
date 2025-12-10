import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'c5ycdc1ptiousqvk.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
