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

export const chains = {
  [CHAIN.MAINNET]: mainnet,
  [CHAIN.TESTNET]: testnet,
  [CHAIN.ETHEREUM]: ethereum,
} as const;

export const chainIdMap = {
  [mainnet.id]: CHAIN.MAINNET,
  [testnet.id]: CHAIN.TESTNET,
  [ethereum.id]: CHAIN.ETHEREUM,
} as const;

export type ChainId = keyof typeof chainIdMap;
export type ChainData = keyof typeof chains;

export { ethereum };
