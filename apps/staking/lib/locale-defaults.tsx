import { CHAIN, chains, SENT_SYMBOL } from '@session/contracts';
import { Social } from '@session/ui/components/SocialLinkList';
import { cn } from '@session/ui/lib/utils';
import { RichTranslationValues } from 'next-intl';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { FAUCET, NETWORK, SESSION_NODE_TIME_STATIC, SOCIALS, TICKER, URL } from './constants';

export const internalLink = (href: string, prefetch?: boolean) => {
  return (children: ReactNode) => (
    <Link href={href} prefetch={prefetch} className="text-session-green cursor-pointer underline">
      {children}
    </Link>
  );
};

export const externalLink = (href: string, className?: string) => {
  return (children: ReactNode) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? 'text-session-green cursor-pointer'}
    >
      {children}
    </a>
  );
};

const defaultExternalLink = (href: string, text: string, className?: string) => () =>
  externalLink(href, className ?? 'text-white underline')(text);

type FontWeight =
  | 'font-extralight'
  | 'font-light'
  | 'font-normal'
  | 'font-medium'
  | 'font-semibold'
  | 'font-bold'
  | 'font-extrabold'
  | 'font-black';

export const text = (weight?: FontWeight, className?: string) => {
  return (children: ReactNode) => <span className={cn(weight, className)}>{children}</span>;
};

export const defaultTranslationElements = {
  'text-extralight': text('font-extralight'),
  'text-light': text('font-light'),
  'text-normal': text('font-normal'),
  'text-medium': text('font-medium'),
  'text-semibold': text('font-semibold'),
  'text-bold': text('font-bold'),
  'text-extrabold': text('font-extrabold'),
  'text-black': text('font-black'),
  'discord-server-link': defaultExternalLink(
    SOCIALS[Social.Discord].link,
    "Session Token's Discord server"
  ),
  'contact-support-link': defaultExternalLink(
    SOCIALS[Social.Discord].link,
    'contact the Session team via Discord.'
  ),
  'incentive-program-link': defaultExternalLink(
    URL.INCENTIVE_PROGRAM,
    'Session Testnet Incentive Program'
  ),
  'gas-faucet-link': externalLink(URL.ARB_SEP_FAUCET, 'text-session-green'),
  'gas-info-link': externalLink(URL.GAS_INFO, 'text-session-green'),
  'oxen-program-link': defaultExternalLink(
    URL.OXEN_SERVICE_NODE_BONUS_PROGRAM,
    'Oxen Service Node Bonus program',
    'text-session-green'
  ),
  'session-token-community-snapshot-link': defaultExternalLink(
    URL.SESSION_TOKEN_COMMUNITY_SNAPSHOT,
    'Snapshot',
    'text-session-green'
  ),
  'my-stakes-link': internalLink('/mystakes'),
} satisfies RichTranslationValues;

export const defaultTranslationVariables = {
  tokenSymbol: SENT_SYMBOL,
  gasTokenSymbol: TICKER.ETH,
  ethTokenSymbol: TICKER.ETH,
  mainnetName: NETWORK.MAINNET,
  testnetName: NETWORK.TESTNET,
  mainNetworkChain: chains[CHAIN.MAINNET].name,
  testNetworkChain: chains[CHAIN.TESTNET].name,
  minimumFaucetGasAmount: FAUCET.MIN_ETH_BALANCE,
  faucetDrip: FAUCET.DRIP,
  oxenProgram: 'Oxen Service Node Bonus program',
  notFoundContentType: 'page',
  smallContributorLeaveRequestDelay:
    SESSION_NODE_TIME_STATIC.SMALL_CONTRIBUTOR_EXIT_REQUEST_WAIT_TIME_DAYS,
} satisfies RichTranslationValues;

export const defaultTranslationValues: RichTranslationValues = {
  ...defaultTranslationElements,
  ...defaultTranslationVariables,
};
