/* eslint-disable @typescript-eslint/no-duplicate-enum-values */

import { CHAIN } from '@session/contracts/chains';
import { Social, SocialLink } from '@session/ui/components/SocialLinkList';
import { LocaleKey } from './locale-util';

/** TODO - Change this to MAINNET when we launch mainnet */
export const preferredChain = CHAIN.TESTNET as const;

export enum URL {
  ARB_SEP_FAUCET = 'https://faucet.quicknode.com/arbitrum/sepolia',
  SESSION_NODE_DOCS = 'https://docs.getsession.org/session-nodes',
  INCENTIVE_PROGRAM = 'https://token.getsession.org/testnet-incentive-program',
  LEARN_MORE_DAILY_REWARDS = 'https://docs.getsession.org/',
  LEARN_MORE_TOTAL_REWARDS = 'https://docs.getsession.org/',
  LEARN_MORE_UNCLAIMED_REWARDS = 'https://docs.getsession.org/',
}

export const SOCIALS: Partial<Record<Social, SocialLink>> = {
  [Social.Discord]: { name: Social.Discord, link: 'https://discord.com/invite/J5BTQdCfXN' },
  [Social.X]: { name: Social.X, link: 'https://x.com/session_token' },
  [Social.Youtube]: { name: Social.Youtube, link: 'https://www.youtube.com/@sessiontv' },
  [Social.Session]: { name: Social.Session, link: 'https://getsession.org/' },
  [Social.Github]: { name: Social.Github, link: 'https://github.com/oxen-io/websites' },
  [Social.RSS]: { name: Social.RSS, link: 'https://token.getsession.org/blog/feed' },
};

export enum FAUCET {
  MIN_ETH_BALANCE = 0.1,
  DRIP = 2000,
}

export enum TICKER {
  ETH = 'ETH',
}

export enum NETWORK {
  MAINNET = 'Mainnet',
  TESTNET = 'Testnet',
}

type LinkItem = {
  href: string;
  dictionaryKey: keyof Omit<LocaleKey['navigation'], 'hamburgerDropdown'>;
  linkType?: 'internal' | 'external';
};

export const ROUTES: LinkItem[] = [
  { dictionaryKey: 'stake', href: '/stake' },
  { dictionaryKey: 'myStakes', href: '/mystakes' },
] as const;

export const FOOTER_LINKS: LinkItem[] = [
  ...ROUTES,
  { dictionaryKey: 'faucet', href: '/faucet' },
  { dictionaryKey: 'tokenSite', href: 'https://token.getsession.org', linkType: 'external' },
  { dictionaryKey: 'support', href: '/support', linkType: 'external' },
  { dictionaryKey: 'docs', href: 'https://docs.getsession.org', linkType: 'external' },
] as const;
