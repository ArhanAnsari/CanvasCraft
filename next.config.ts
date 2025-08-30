import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
   typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: {
    position: "bottom-right",
  },
  // Enable React strict mode
  reactStrictMode: true,
};

export default nextConfig;
