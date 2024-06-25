import { isProduction } from '@session/util/env';
import type { WagmiMetadata } from '@session/wallet/lib/wagmi';
import type { Metadata } from 'next';

export const siteMetadata: Metadata = {
  title: 'Session Staking',
  description: 'Session Staking',
};

const url = isProduction() ? 'https://stake.getsession.org' : 'http://localhost:3000';

export const wagmiMetadata: WagmiMetadata = {
  name: 'Session Staking',
  description: 'Session Staking',
  url,
  icons: [`${url}/images/icon.png`],
};
