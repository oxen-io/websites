import { getEnvironmentTaggedDomain } from '@session/util/env';
import type { WagmiMetadata } from '@session/wallet/lib/wagmi';
import type { Metadata } from 'next';

// TODO - Fill out all require site metadata fields
export const siteMetadata: Metadata = {
  title: 'Session Staking',
  description: 'Session Staking',
};

const url = `https://${getEnvironmentTaggedDomain('stake')}.getsession.org`;

export const wagmiMetadata: WagmiMetadata = {
  name: 'Session Staking',
  description: 'Session Staking',
  url,
  icons: [`${url}/images/icon.png`],
};
