/* eslint-disable @typescript-eslint/no-duplicate-enum-values */

import { CHAIN } from '@session/contracts/chains';

/** TODO - Change this to MAINNET when we launch mainnet */
export const preferredChain = CHAIN.TESTNET as const;

export enum URL {
  ARB_SEP_FAUCET = 'https://faucet.quicknode.com/arbitrum/sepolia',
  SESSION_NODE_DOCS = 'https://docs.getsession.org/session-nodes',
  DISCORD_INVITE = 'https://discord.com/invite/J5BTQdCfXN',
  INCENTIVE_PROGRAM = 'https://token.getsession.org/testnet-incentive-program',
  LEARN_MORE_DAILY_REWARDS = 'https://docs.getsession.org/',
  LEARN_MORE_TOTAL_REWARDS = 'https://docs.getsession.org/',
  LEARN_MORE_UNCLAIMED_REWARDS = 'https://docs.getsession.org/',
}

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
