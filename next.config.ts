import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['bun:sqlite'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
