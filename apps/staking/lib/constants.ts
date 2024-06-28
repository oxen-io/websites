import { CHAIN } from '@session/contracts/chains';

/** TODO - Change this to MAINNET when we launch mainnet */
export const preferredChain = CHAIN.TESTNET as const;

export enum URL {
  ARB_SEP_FAUCET = 'https://faucet.quicknode.com/arbitrum/sepolia',
}

export enum FAUCET {
  MIN_ETH_BALANCE = 0.1,
  DRIP = 2000,
}

export enum TICKER {
  ETH = 'ETH',
}
