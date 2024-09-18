'use client';

import type { ReadContractData } from 'wagmi/query';
import type { RewardRatePoolAbi } from '../abis';
import { type ContractReadQueryProps, useContractReadQuery } from './useContractReadQuery';
import { useChain } from './useChain';

type RewardRate = ReadContractData<typeof RewardRatePoolAbi, 'rewardRate', []>;

export type RewardRateQuery = ContractReadQueryProps & {
  /** The reward rate */
  rewardRate: RewardRate;
};

export function useRewardRateQuery(): RewardRateQuery {
  const chain = useChain();
  const { data: rewardRate, ...rest } = useContractReadQuery({
    contract: 'RewardRatePool',
    functionName: 'rewardRate',
    chain,
  });

  return {
    rewardRate,
    ...rest,
  };
}
