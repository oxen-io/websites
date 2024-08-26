/* eslint-disable @typescript-eslint/no-duplicate-enum-values */

import { CHAIN } from '@session/contracts/chains';
import { Social, SocialLink } from '@session/ui/components/SocialLinkList';
import { LocaleKey } from './locale-util';
import { getEnvironmentTaggedDomain } from '@session/util/env';

/** TODO - Change this to MAINNET when we launch mainnet */
export const preferredChain = CHAIN.TESTNET as const;

export const BASE_URL = `https://${getEnvironmentTaggedDomain('stake')}.getsession.org`;

export enum URL {
  ARB_SEP_FAUCET = 'https://faucet.quicknode.com/arbitrum/sepolia',
  GAS_INFO = 'https://ethereum.org/en/developers/docs/gas',
  SESSION_NODE_DOCS = 'https://docs.getsession.org/session-nodes',
  INCENTIVE_PROGRAM = 'https://token.getsession.org/testnet-incentive-program',
  LEARN_MORE_DAILY_REWARDS = 'https://docs.getsession.org/staking-reward-pool#network-reward-rate',
  LEARN_MORE_TOTAL_REWARDS = 'https://docs.getsession.org/staking-reward-pool#network-reward-rate',
  LEARN_MORE_UNCLAIMED_REWARDS = 'https://docs.getsession.org/staking-reward-pool#claiming-rewards',
  OXEN_SERVICE_NODE_BONUS_PROGRAM = 'https://swap.oxen.io/',
  SESSION_TOKEN_COMMUNITY_SNAPSHOT = 'https://token.getsession.org/testnet-incentive-program',
  INCENTIVE_PROGRAM_TOS = 'https://token.getsession.org/incentive-program-terms',
  BUG_BOUNTY_PROGRAM = 'https://token.getsession.org/bug-bounty-program',
  BUG_BOUNTY_TOS = 'https://token.getsession.org/bug-bounty-terms',
  SESSION_NODE_SOLO_SETUP_DOCS = 'https://docs.getsession.org/class-is-in-session/session-stagenet-single-contributor-node-setup',
  REMOVE_TOKEN_FROM_WATCH_LIST = 'https://support.metamask.io/managing-my-tokens/custom-tokens/how-to-remove-a-token/',
}

export const LANDING_BUTTON_URL = {
  PRIMARY: '/stake',
  SECONDARY: URL.BUG_BOUNTY_PROGRAM,
};

export const TOS_LOCKED_PATHS = ['/stake', '/mystakes'];

export enum COMMUNITY_DATE {
  SESSION_TOKEN_COMMUNITY_SNAPSHOT = '2024-06-12',
  OXEN_SERVICE_NODE_BONUS_PROGRAM = '2024-06-12',
}

export const SOCIALS = {
  [Social.Discord]: { name: Social.Discord, link: 'https://discord.com/invite/J5BTQdCfXN' },
  [Social.X]: { name: Social.X, link: 'https://x.com/session_token' },
  [Social.Youtube]: { name: Social.Youtube, link: 'https://www.youtube.com/@sessiontv' },
  [Social.Session]: { name: Social.Session, link: 'https://getsession.org/' },
  [Social.Github]: { name: Social.Github, link: 'https://github.com/oxen-io/websites' },
  [Social.RSS]: { name: Social.RSS, link: 'https://token.getsession.org/blog/feed' },
} satisfies Partial<Record<Social, SocialLink>>;

export enum FAUCET {
  MIN_ETH_BALANCE = 0.001,
  DRIP = 240,
}

export enum FAUCET_ERROR {
  INVALID_ADDRESS = 'invalidAddress',
  INCORRECT_CHAIN = 'incorrectChain',
  // INSUFFICIENT_ETH = 'insufficientEth',
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
  linkType?: 'internal' | 'external';
};

export const ROUTES: LinkItem[] = [
  { dictionaryKey: 'stake', href: '/stake' },
  { dictionaryKey: 'register', href: '/register' },
  { dictionaryKey: 'myStakes', href: '/mystakes' },
  { dictionaryKey: 'faucet', href: '/faucet' },
] as const;

export const EXTERNAL_ROUTES: LinkItem[] = [
  { dictionaryKey: 'tokenSite', href: 'https://token.getsession.org', linkType: 'external' },
  { dictionaryKey: 'support', href: '/support', linkType: 'external' },
  { dictionaryKey: 'docs', href: 'https://docs.getsession.org', linkType: 'external' },
  { dictionaryKey: 'explorer', href: 'https://stagenet.oxen.observer', linkType: 'external' },
] as const;

export enum QUERY {
  /** 60 seconds */
  STALE_TIME_DEFAULT = 60 * 1000,
  /** 1 second */
  STALE_TIME_DEFAULT_DEV = 1000,
  /** 1 second */
  STALE_TIME_REGISTRATIONS_PAGE = 1000,
  /** 1 second */
  STALE_TIME_REGISTRATIONS_LIST_DEV = 1000,
  /** 60 seconds */
  STALE_TIME_REGISTRATIONS_LIST = 60 * 1000,
  /** 2 minutes */
  STALE_TIME_CLAIM_REWARDS = 2 * 60 * 1000,
}

export enum SESSION_NODE {
  /** 120 SENT  */
  FULL_STAKE_AMOUNT = '120000000000',
  /** Average blocks per millisecond (~2 minutes per block) */
  MS_PER_BLOCK = 2 * 60 * 1000,
  /** Average millisecond per block (~2 minutes per block) */
  BLOCK_VELOCITY = 2 / 60 / 4 / 1000,
}

export enum TOAST {
  ERROR_COLLAPSE_LENGTH = 128,
}

export enum DYNAMIC_MODULE {
  /** The number of decimal places to round SENT values to */
  SENT_ROUNDED_DECIMALS = 2,
}

export enum HANDRAIL_THRESHOLD {
  /** 0.005 SENT */
  CLAIM_REWARDS_AMOUNT = '5000000',
}
