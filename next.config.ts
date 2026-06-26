import type { NextConfig } from "next";

// Fix for Node 25 experimental localStorage breaking Next.js SSR dev overlay
if (typeof globalThis !== 'undefined') {
  if (globalThis.localStorage && typeof globalThis.localStorage.getItem !== 'function') {
    (globalThis as any).localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    };
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['loremflickr.com', 'picsum.photos'], // Add any image domains you'll use
    unoptimized: process.env.NODE_ENV === 'development',
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false, // Security: Don't send X-Powered-By header
  typescript: {
    // Ignore type errors in production builds
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
