import { defineChain } from 'viem';
import { arbitrum, arbitrumSepolia, mainnet as ethereum } from 'viem/chains';

export const mainnet = defineChain({
  ...arbitrum,
  // TODO - Investigate if we need to add a nativeCurrency object here for contract writes
  // nativeCurrency: { name: 'Session Token', symbol: 'SENT', decimals: 9 },
});

export const testnet = defineChain({
  ...arbitrumSepolia,
  // TODO - Investigate if we need to add a nativeCurrency object here for contract writes
  // nativeCurrency: { name: 'Session Token', symbol: 'SENT', decimals: 9 },
});

export enum CHAIN {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  ETHEREUM = 'ethereum',
}

const chainNames = Object.values(CHAIN);

export const chains = {
  [CHAIN.MAINNET]: mainnet,
  [CHAIN.TESTNET]: testnet,
  [CHAIN.ETHEREUM]: ethereum,
} as const;

export type ChainData = keyof typeof chains;

/**
 * Checks if a given string is a valid chain.
 * @param chain - The chain to check.
 * @returns A boolean indicating whether the chain is valid.
 */
export function isChain(chain: string): chain is CHAIN {
  return chainNames.includes(chain as CHAIN);
}

export { ethereum };
