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
    [CHAIN.MAINNET]: '0x7FBDC29b81e410eB0eaE75Dca64a76d898EAc4A9',
    [CHAIN.TESTNET]: '0x7FBDC29b81e410eB0eaE75Dca64a76d898EAc4A9',
  },
  ServiceNodeRewards: {
    /** @deprecated - The Mainnet value is a mock value */
    [CHAIN.MAINNET]: '0xEF43cd64528eA89966E251d4FE17c660222D2c9d',
    [CHAIN.TESTNET]: '0xEF43cd64528eA89966E251d4FE17c660222D2c9d',
  },
  RewardRatePool: {
    /** @deprecated - The Mainnet value is a mock value */
    [CHAIN.MAINNET]: '0x408bCc6C9b942ECc4F289C080d2A1a2a3617Aff8',
    [CHAIN.TESTNET]: '0x408bCc6C9b942ECc4F289C080d2A1a2a3617Aff8',
  },
} as const;

export const SENT_DECIMALS = 9;
export const SENT_SYMBOL = 'SENT';
