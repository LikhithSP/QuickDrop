import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true, // Required for static export
  },
  // Enable trailing slashes for Netlify
  trailingSlash: true,
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Configure domain for Netlify
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://snapdropx.netlify.app' : undefined,
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://snapdropx.netlify.app',
  },
  // Explicitly specify which Next.js features to use
  experimental: {
    appDir: true,
  },
  // Create service worker for offline capability
  poweredByHeader: false,
};

export default nextConfig;
