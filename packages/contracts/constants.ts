import { type Address } from 'viem';
import type { ContractWithAbiName } from './abis';
import { CHAIN } from './chains';

const contracts = [
  'RewardRatePool',
  'SENT',
  'ServiceNodeRewards',
] as const satisfies Array<ContractWithAbiName>;
export type ContractName = (typeof contracts)[number];

// TODO - Replace Mainnet addresses with the correct addresses once they are available
export const addresses: Record<ContractName, Record<CHAIN.MAINNET | CHAIN.TESTNET, Address>> = {
  SENT: {
    /** @deprecated - The Mainnet value is a mock value */
    [CHAIN.MAINNET]: '0xbF3e23d546D19302e911AAc26B3c01A73c7De380',
    [CHAIN.TESTNET]: '0xbF3e23d546D19302e911AAc26B3c01A73c7De380',
  },
  ServiceNodeRewards: {
    /** @deprecated - The Mainnet value is a mock value */
    [CHAIN.MAINNET]: '0xC75A34c31C2b8780a20AfCD75473Ac0Ad82352B6',
    [CHAIN.TESTNET]: '0xC75A34c31C2b8780a20AfCD75473Ac0Ad82352B6',
  },
  RewardRatePool: {
    /** @deprecated - The Mainnet value is a mock value */
    [CHAIN.MAINNET]: '0x821340A591C10492d7F494285BABFcc2645396a3',
    [CHAIN.TESTNET]: '0x821340A591C10492d7F494285BABFcc2645396a3',
  },
} as const;

export const SENT_DECIMALS = 9;
export const SENT_SYMBOL = 'SENT';
