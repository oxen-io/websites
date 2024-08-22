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
export const addresses: Record<ContractName, Record<CHAIN, Address>> = {
  SENT: {
    /** @deprecated - The Mainnet value is a mock value */
    [CHAIN.MAINNET]: '0x70c1f36C9cEBCa51B9344121D284D85BE36CD6bB',
    /** @deprecated - The Eth value is a mock value */
    [CHAIN.ETHEREUM]: '0x70c1f36C9cEBCa51B9344121D284D85BE36CD6bB',
    [CHAIN.TESTNET]: '0x70c1f36C9cEBCa51B9344121D284D85BE36CD6bB',
  },
  ServiceNodeRewards: {
    /** @deprecated - The Mainnet value is a mock value */
    [CHAIN.MAINNET]: '0xb691e7C159369475D0a3d4694639ae0144c7bAB2',
    /** @deprecated - The Eth value is a mock value */
    [CHAIN.ETHEREUM]: '0xb691e7C159369475D0a3d4694639ae0144c7bAB2',
    [CHAIN.TESTNET]: '0xb691e7C159369475D0a3d4694639ae0144c7bAB2',
  },
  RewardRatePool: {
    /** @deprecated - The Mainnet value is a mock value */
    [CHAIN.MAINNET]: '0x84a648F74Eaf037dD9558987F6179E692d5F2566',
    /** @deprecated - The Eth value is a mock value */
    [CHAIN.ETHEREUM]: '0x84a648F74Eaf037dD9558987F6179E692d5F2566',
    [CHAIN.TESTNET]: '0x84a648F74Eaf037dD9558987F6179E692d5F2566',
  },
} as const;

/**
 * @deprecated - Use {@link addresses} instead
 */
export const addressesV1: Record<ContractName, Record<CHAIN, Address>> = {
  SENT: {
    /** @deprecated - The Mainnet value is a mock value */
    [CHAIN.MAINNET]: '0x7FBDC29b81e410eB0eaE75Dca64a76d898EAc4A9',
    /** @deprecated - The Eth value is a mock value */
    [CHAIN.ETHEREUM]: '0x7FBDC29b81e410eB0eaE75Dca64a76d898EAc4A9',
    [CHAIN.TESTNET]: '0x7FBDC29b81e410eB0eaE75Dca64a76d898EAc4A9',
  },
  ServiceNodeRewards: {
    /** @deprecated - The Mainnet value is a mock value */
    [CHAIN.MAINNET]: '0xEF43cd64528eA89966E251d4FE17c660222D2c9d',
    /** @deprecated - The Eth value is a mock value */
    [CHAIN.ETHEREUM]: '0xEF43cd64528eA89966E251d4FE17c660222D2c9d',
    [CHAIN.TESTNET]: '0xEF43cd64528eA89966E251d4FE17c660222D2c9d',
  },
  RewardRatePool: {
    /** @deprecated - The Mainnet value is a mock value */
    [CHAIN.MAINNET]: '0x408bCc6C9b942ECc4F289C080d2A1a2a3617Aff8',
    /** @deprecated - The Eth value is a mock value */
    [CHAIN.ETHEREUM]: '0x408bCc6C9b942ECc4F289C080d2A1a2a3617Aff8',
    [CHAIN.TESTNET]: '0x408bCc6C9b942ECc4F289C080d2A1a2a3617Aff8',
  },
} as const;

export const SENT_DECIMALS = 9;
export const SENT_SYMBOL = 'SENT';
