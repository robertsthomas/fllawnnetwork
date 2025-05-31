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
