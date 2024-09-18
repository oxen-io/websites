import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Abi, ContractFunctionArgs, ContractFunctionName, ReadContractErrorType } from 'viem';
import { useReadContract } from 'wagmi';
import { ReadContractData } from 'wagmi/query';
import { ContractAbis, Contracts } from '../abis';
import { CHAIN, chains } from '../chains';
import { addresses, type ContractName } from '../constants';
import type { GenericContractStatus } from './useContractWriteQuery';

export type ContractReadQueryProps = {
  /** The status of the read contract */
  status: GenericContractStatus;
  /** Contract read error */
  error: ReadContractErrorType | null;
  /** Re-fetch the contract read */
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<unknown, ReadContractErrorType>>;
};

export type UseContractRead<Data> = ContractReadQueryProps & {
  /** The data from the contract */
  data: Data;
};

export type ContractReadQueryFetchOptions = {
  /** Set enabled to true to enable automatic fetching when the query mounts or changes query keys. To manually fetch the query, use the readContract method returned from the useContractReadQuery instance. Defaults to false. */
  enabled?: boolean;
  /** Chain the contract is on */
  chain: CHAIN;
};

export function useContractReadQuery<
  T extends ContractName,
  C extends ContractAbis[T],
  FName extends ContractFunctionName<C, 'pure' | 'view'>,
  Args extends ContractFunctionArgs<C, 'pure' | 'view', FName>,
  Data = ReadContractData<C, FName, Args>,
>({
  contract,
  functionName,
  enabled,
  args,
  chain,
}: {
  contract: T;
  args?: Args;
  functionName: FName;
} & ContractReadQueryFetchOptions): UseContractRead<Data> {
  const abi = useMemo(() => Contracts[contract], [contract]);
  const address = useMemo(() => addresses[contract][chain], [contract, chain]);

  const { data, status, refetch, error } = useReadContract({
    address: address,
    abi: abi as Abi,
    functionName: functionName,
    args: args as ContractFunctionArgs,
    chainId: chains[chain].id,
    query: { enabled },
  });

  return {
    data: data as Data,
    status,
    refetch,
    error,
  };
}

export const mergeContractReadStatuses = (
  status1: GenericContractStatus,
  status2: GenericContractStatus
) => {
  if (status1 === status2) return status1;
  if (status1 === 'error' || status2 === 'error') return 'error';
  if (status1 === 'pending' || status2 === 'pending') return 'pending';
  return 'pending';
};
