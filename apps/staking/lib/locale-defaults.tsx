import { CHAIN, SENT_SYMBOL, chains } from '@session/contracts';
import { cn } from '@session/ui/lib/utils';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { NETWORK, TICKER, URL } from './constants';

export const internalLink = (href: string, prefetch?: boolean) => {
  return (children: ReactNode) => (
    <Link href={href} prefetch={prefetch}>
      {children}
    </Link>
  );
};

export const externalLink = (href: string) => {
  return (children: ReactNode) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
      {children}
    </a>
  );
};

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
};

export const defaultTranslationVariables = {
  tokenSymbol: SENT_SYMBOL,
  gasTokenSymbol: TICKER.ETH,
  ethTokenSymbol: TICKER.ETH,
  mainnetName: NETWORK.MAINNET,
  testnetName: NETWORK.TESTNET,
  mainNetworkChain: chains[CHAIN.MAINNET].name,
  testNetworkChain: chains[CHAIN.TESTNET].name,
  discordServerLink: externalLink(URL.DISCORD_INVITE)("Session Token's Discord server"),
  contactSupportLink: externalLink(URL.DISCORD_INVITE)('contact the Session team via Discord.'),
  incentiveProgramLink: externalLink(URL.INCENTIVE_PROGRAM)('Session Testnet Incentive Program'),
  recommendedGasFaucetLink: externalLink(URL.ARB_SEP_FAUCET)(
    `QuickNode ${chains[CHAIN.TESTNET].name} Faucet`
  ),
};

export const defaultTranslationValues = {
  ...defaultTranslationElements,
  ...defaultTranslationVariables,
};
