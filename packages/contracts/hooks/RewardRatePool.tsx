'use client';
import { ContractFunctionArgs } from 'viem';
import type { RewardRatePoolAbi } from '../abis';
import { ReadContractQuery, useContractReadQuery } from './contract-hooks';
import type { ReadContractData } from 'wagmi/query';
import { getUnixTimestamp } from '@session/util/date';

export type RewardRateQuery = ReadContractQuery & {
  /** Get the reward rate */
  getRewardRate: () => void;
  /** The reward rate */
  rewardRate: ReadContractData<typeof RewardRatePoolAbi, 'rewardRate', [bigint]>;
};

export function useRewardRateQuery(
  props?:
    | {
        startEnabled: never;
        args: never;
      }
    | {
        startEnabled: boolean;
        args: ContractFunctionArgs<typeof RewardRatePoolAbi, 'pure' | 'view', 'rewardRate'>;
      }
): RewardRateQuery {
  const {
    data: rewardRate,
    readContract,
    ...rest
  } = useContractReadQuery({
    contract: 'RewardRatePool',
    functionName: 'rewardRate',
    startEnabled: props?.startEnabled ?? false,
    args: props?.args,
  });

  const getRewardRate = () => {
    readContract({ args: [BigInt(getUnixTimestamp())] });
  };

  return {
    rewardRate,
    getRewardRate,
    ...rest,
  };
}
