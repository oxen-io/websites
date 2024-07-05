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
  OXEN_SERVICE_NODE_BONUS_PROGRAM = 'https://swap.oxen.io/',
  SESSION_TOKEN_COMMUNITY_SNAPSHOT = 'https://token.getsession.org/testnet-incentive-program',
}

export enum COMMUNITY_DATE {
  SESSION_TOKEN_COMMUNITY_SNAPSHOT = '2024-06-09',
  OXEN_SERVICE_NODE_BONUS_PROGRAM = '2024-06-12',
}

export enum FAUCET {
  MIN_ETH_BALANCE = 0.01,
  DRIP = 240,
}

export enum FAUCET_ERROR {
  INVALID_ADDRESS = 'invalidAddress',
  INCORRECT_CHAIN = 'incorrectChain',
  INSUFFICIENT_ETH = 'insufficientEth',
  FAUCET_OUT_OF_TOKENS = 'faucetOutOfTokens',
  INVALID_SERVICE = 'invalidService',
  INVALID_OXEN_ADDRESS = 'invalidOxenAddress',
  ALREADY_USED = 'alreadyUsed',
  ALREADY_USED_SERVICE = 'alreadyUsedService',
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
};

export const ROUTES: LinkItem[] = [
  { dictionaryKey: 'stake', href: '/stake' },
  { dictionaryKey: 'myStakes', href: '/mystakes' },
] as const;

export const SOCIALS: Partial<Record<Social, SocialLink>> = {
  [Social.Discord]: { name: Social.Discord, link: 'https://discord.com/invite/J5BTQdCfXN' },
  [Social.Github]: { name: Social.Github, link: 'https://github.com/oxen-io/websites' },
  [Social.RSS]: { name: Social.RSS, link: 'https://token.getsession.org/blog/feed' },
  [Social.Session]: { name: Social.Session, link: 'https://getsession.org/' },
  [Social.X]: { name: Social.X, link: 'https://x.com/session_token' },
  [Social.Youtube]: { name: Social.Youtube, link: 'https://www.youtube.com/@sessiontv' },
};
