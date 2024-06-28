'use client';

import type { Address, ContractFunctionArgs } from 'viem';
import type { ReadContractData } from 'wagmi/query';
import type { ServiceNodeRewardsAbi } from '../abis';
import {
  ReadContractQuery,
  WriteContractQuery,
  useContractReadQuery,
  useContractWriteQuery,
} from './contract-hooks';

export type ClaimRewardsQuery = WriteContractQuery & {
  /** Claim rewards */
  claimRewards: () => void;
};

export function useClaimRewardsQuery({
  address,
}: {
  address: Address | undefined;
}): ClaimRewardsQuery {
  const { writeContract, isPending, isConfirming, isConfirmed, isError, error, throwError } =
    useContractWriteQuery({
      contract: 'ServiceNodeRewards',
      functionName: 'claimRewards',
    });

  const claimRewards = () => {
    if (!address) {
      throwError(new Error('Address is required to claim rewards'));
      return;
    }
    writeContract({ args: [] });
  };

  return {
    claimRewards,
    isPending,
    isConfirming,
    isConfirmed,
    isError,
    error,
  };
}

export type UpdateRewardsBalanceQuery = WriteContractQuery & {
  /** Update rewards balance */
  updateRewardsBalance: () => void;
};

export function useUpdateRewardsBalanceQuery({
  address,
}: {
  address: Address | undefined;
}): UpdateRewardsBalanceQuery {
  const { isPending, isConfirming, isConfirmed, isError, error, throwError } =
    useContractWriteQuery({
      contract: 'ServiceNodeRewards',
      functionName: 'updateRewardsBalance',
    });

  const updateRewardsBalance = () => {
    if (!address) {
      throwError(new Error('Address is required to update rewards balance'));
      return;
    }
    throw new Error('not implemented yet');
    // writeContract({ args: [address] });
  };

  return {
    updateRewardsBalance,
    isPending,
    isConfirming,
    isConfirmed,
    isError,
    error,
  };
}

export type TotalNodesQuery = ReadContractQuery & {
  /** Update rewards balance */
  getTotalNodes: () => void;
  /** The total number of nodes */
  totalNodes: ReadContractData<typeof ServiceNodeRewardsAbi, 'totalNodes', []>;
};

export function useTotalNodesQuery(
  props?:
    | {
        startEnabled: never;
        args: never;
      }
    | {
        startEnabled: boolean;
        args: ContractFunctionArgs<typeof ServiceNodeRewardsAbi, 'pure' | 'view', 'totalNodes'>;
      }
): TotalNodesQuery {
  const {
    data: totalNodes,
    readContract,
    ...rest
  } = useContractReadQuery({
    contract: 'ServiceNodeRewards',
    functionName: 'totalNodes',
    startEnabled: props?.startEnabled ?? false,
    args: props?.args,
  });

  const getTotalNodes = () => {
    readContract({ args: [] });
  };

  return {
    totalNodes,
    getTotalNodes,
    ...rest,
  };
}
