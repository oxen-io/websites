import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/locale-server.ts');

const getSENTStakingApiUrl = () => {
  let url = process.env.NEXT_PUBLIC_SENT_STAKING_API_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_SENT_STAKING_API_URL is not set');
  }

  if (url.endsWith('/')) {
    url = url.substring(0, url.length - 1);
  }

  console.log('SENT Staking API URL:', url);

  return url;
};

const getSENTExplorerApiUrl = () => {
  let url = process.env.NEXT_PUBLIC_SENT_EXPLORER_API_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_SENT_EXPLORER_API_URL is not set');
  }

  if (url.endsWith('/')) {
    url = url.substring(0, url.length - 1);
  }

  console.log('SENT Explorer API URL:', url);

  return url;
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@session/ui',
    '@session/wallet',
    '@session/contracts',
    '@session/util',
    '@session/feature-flags',
    'better-sqlite3-multiple-ciphers',
  ],
  experimental: {
    serverComponentsExternalPackages: ['pino', 'pino-pretty'],
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    if (process.env.NO_MINIFY?.toLowerCase() === 'true') {
      config.optimization = {
        minimize: false,
      };
    }
    return config;
  },
  redirects: async () => {
    return [
      {
        source: '/explorer/:path*',
        destination: 'https://sepolia.arbiscan.io/:path*',
        permanent: false,
      },
      {
        source: '/support',
        destination: 'https://discord.com/invite/J5BTQdCfXN',
        permanent: false,
      },
      {
        source: '/nodes',
        destination: '/stake',
        permanent: false,
      },
    ];
  },
  rewrites: async () => {
    return [
      {
        source: '/api/ssb/:path*',
        destination: `${getSENTStakingApiUrl()}/:path*`,
      },
      {
        source: '/api/explorer',
        destination: getSENTExplorerApiUrl(),
      },
    ];
  },
};

export default withNextIntl(nextConfig);
