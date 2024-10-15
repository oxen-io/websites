import createNextIntlPlugin from 'next-intl/plugin';
import withPlaiceholder from '@plaiceholder/next';

const withNextIntl = createNextIntlPlugin('./lib/locale-server.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@session/ui',
    '@session/util-js',
    '@session/util-logger',
    '@session/sanity-cms',
  ],
  experimental: {
    serverComponentsExternalPackages: ['pino', 'pino-pretty'],
    taint: true,
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  images: {
    remotePatterns: [{ hostname: 'cdn.sanity.io' }],
  },
  async rewrites() {
    return [
      ...[
        '/rss',
        '/feed',
        '/feed.xml',
        '/blog.xml',
        '/blog/rss',
        '/blog/feed',
        '/blog/rss.xml',
        '/blog/feed.xml',
      ].map((source) => ({
        source,
        destination: '/rss.xml',
      })),
    ];
  },
};

export default withNextIntl(withPlaiceholder(nextConfig));
