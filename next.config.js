// This file sets up the build script for Netlify
// @ts-check
const { PHASE_PRODUCTION_BUILD } = require('next/constants');

/**
 * @type {import('next').NextConfig}
 */
module.exports = (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    // Base config options from next.config.ts
    output: 'export',
    distDir: 'out',
    images: {
      unoptimized: true,
    },
    trailingSlash: true,
    productionBrowserSourceMaps: false,
    env: {
      NEXT_PUBLIC_SITE_URL: 'https://snapdropx.netlify.app',
    },
  }
  
  // Add specific Netlify optimizations for production build
  if (phase === PHASE_PRODUCTION_BUILD) {
    // Special handling for production builds on Netlify
    return {
      ...nextConfig,
      generateBuildId: async () => {
        // You can add a unique build ID here if needed
        return 'snapdropx-build-' + new Date().toISOString().replace(/[^0-9]/g, '')
      },
    }
  }

  return nextConfig
}
