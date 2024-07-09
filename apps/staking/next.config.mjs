import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/locale-server.ts');

const getSENTStakingApiUrl = () => {
  let url = process.env.NEXT_PUBLIC_SENT_STAKING_API_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_SENT_STAKING_API_URL is not set');
  }

  if (!url.endsWith('/')) {
    url += '/';
  }

  console.log('SENT Staking API URL:', url);

  return url;
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@session/ui',
    '@session/wallet',
    '@session/contracts',
    'better-sqlite3-multiple-ciphers',
  ],
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  rewrites: async () => {
    return [
      {
        source: '/api/sent/:path*',
        destination: `${getSENTStakingApiUrl()}:path*`,
      },
    ];
  },
  redirects: async () => {
    return [
      {
        source: '/explorer/:contract*',
        destination: 'https://sepolia.arbiscan.io/address/:contract*',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
