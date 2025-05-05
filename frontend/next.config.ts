import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Three js
  webpack: (config) => {
    config.externals.push({
      canvas: 'canvas',
    });
    return config;
  },
};

export default nextConfig;
