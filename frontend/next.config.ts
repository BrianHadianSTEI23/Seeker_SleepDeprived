import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // reactStrictMode: true,
  // Three js
  webpack: (config) => {
    config.externals.push({
      canvas: 'canvas',
    });
    return config;
  },
};

export default nextConfig
