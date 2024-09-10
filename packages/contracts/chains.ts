import { arbitrum as mainnet, arbitrumSepolia as testnet, mainnet as ethereum } from 'viem/chains';

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

export const chainForId = {
  [mainnet.id]: CHAIN.MAINNET,
  [testnet.id]: CHAIN.TESTNET,
  [ethereum.id]: CHAIN.ETHEREUM,
} as const;

export type AllowedChainId = keyof typeof chainForId;

export type ChainData = keyof typeof chains;

/**
 * Checks if a given string is a valid chain.
 * @param chain - The chain to check.
 * @returns A boolean indicating whether the chain is valid.
 */
export function isChain(chain: string): chain is CHAIN {
  return chainNames.includes(chain as CHAIN);
}

export { ethereum, mainnet, testnet };
