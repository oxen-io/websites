'use client';

import { ContractFunctionArgs } from 'viem';
import { CHAIN, chains } from '../chains';
import type { ReadContractData } from 'wagmi/query';
import type { RewardRatePoolAbi } from '../abis';
import {
  ContractReadQueryFetchOptions,
  ReadContractQuery,
  useContractReadQuery,
} from './contract-hooks';

export type RewardRateQuery = ReadContractQuery & {
  /** Get the reward rate */
  getRewardRate: () => void;
  /** The reward rate */
  rewardRate: ReadContractData<typeof RewardRatePoolAbi, 'rewardRate', []>;
};

export function useRewardRateQuery(
  props?: ContractReadQueryFetchOptions<
    ContractFunctionArgs<typeof RewardRatePoolAbi, 'pure' | 'view', 'rewardRate'>
  >
): RewardRateQuery {
  const {
    data: rewardRate,
    readContract,
    ...rest
  } = useContractReadQuery({
    contract: 'RewardRatePool',
    functionName: 'rewardRate',
    chainId: chains[CHAIN.TESTNET].id,
    startEnabled: props?.startEnabled ?? false,
    args: props?.args,
  });

  const getRewardRate = () => {
    readContract({ args: [] });
  };

  return {
    rewardRate,
    getRewardRate,
    ...rest,
  };
}
