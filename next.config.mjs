// This config file configures the Next.js build process

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: ['fiifesewwhuaqubvnnwd.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      // Allow data URLs for QR codes
      {
        protocol: 'data',
        hostname: '**',
      },
    ],
  },
  // Disable automatic static optimization for these paths
  // This ensures they're rendered on client-side only
  experimental: {
    // Disable "Powered by Vercel" header
    poweredByHeader: false,
  },
};

export default nextConfig;
