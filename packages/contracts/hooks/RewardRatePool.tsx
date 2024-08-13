'use client';

import type { ReadContractData } from 'wagmi/query';
import type { RewardRatePoolAbi } from '../abis';
import { type ContractReadQueryProps, useContractReadQuery } from './useContractReadQuery';
import { useChain } from './useChain';

type RewardRate = ReadContractData<typeof RewardRatePoolAbi, 'rewardRate', []>;

export type RewardRateQuery = ContractReadQueryProps & {
  /** Get the reward rate */
  getRewardRate: () => void;
  /** The reward rate */
  rewardRate: RewardRate;
};

export function useRewardRateQuery(): RewardRateQuery {
  const chain = useChain();
  const {
    data: rewardRate,
    readContract,
    ...rest
  } = useContractReadQuery({
    contract: 'RewardRatePool',
    functionName: 'rewardRate',
    startEnabled: true,
    chain,
  });

  return {
    rewardRate,
    getRewardRate: readContract,
    ...rest,
  };
}
