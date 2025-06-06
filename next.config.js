/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'images.pexels.com',
      'streetviewpixels-pa.googleapis.com',
      'fllawnnetwork.com',
      'images.unsplash.com',
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ];
  },
  // Add redirects to standardize on www version
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://www.fllawnnetwork.com/',
        permanent: true,
        basePath: false,
        has: [
          {
            type: 'host',
            value: 'fllawnnetwork.com',
          },
        ],
      },
      {
        source: '/:path*',
        destination: 'https://www.fllawnnetwork.com/:path*',
        permanent: true,
        basePath: false,
        has: [
          {
            type: 'host',
            value: 'fllawnnetwork.com',
          },
        ],
      },
    ];
  },
  // Remove skipTrailingSlashRedirect to ensure consistent URL patterns
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add hostname configuration to allow connections from your domain
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://www.fllawnnetwork.com',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
