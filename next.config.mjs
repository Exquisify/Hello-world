// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';
import withBundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // Automatically compresses and converts assets to high-performance modern formats
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  experimental: {
    // Limits bundle bloat by tree-shaking heavy third-party layout and animation libraries
    optimizePackageImports: ['lucide-react', 'lodash', 'framer-motion'],
  },
};

// Wraps the configuration with next-intl and interactive visual dependency analyzer
const configWithAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(withNextIntl(nextConfig));

export default configWithAnalyzer;