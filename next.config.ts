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
  // Exclude expo-app from Next.js build
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/expo-app/**', '**/node_modules/**'],
    };
    return config;
  },
};

export default nextConfig;
