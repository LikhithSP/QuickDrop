// This config file configures the Next.js build process

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable server-side rendering for paths with Supabase functionality
  // This prevents server rendering issues with Supabase
  output: 'standalone',
  images: {
    domains: ['fiifesewwhuaqubvnnwd.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/**',
      },
    ],
  },
  // Make these pages client-side only
  experimental: {
    // PoweredBy header is disabled for cleaner responses
    poweredByHeader: false,
  },
  // Handle data URLs for QR codes
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'data',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
