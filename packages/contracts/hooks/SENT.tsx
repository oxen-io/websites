'use client';

import { Address, ContractFunctionArgs } from 'viem';
import { useAccount } from 'wagmi';
import { ReadContractData } from 'wagmi/query';
import { SENTAbi } from '../abis';
import {
  ContractReadQueryFetchOptions,
  ReadContractQuery,
  useContractReadQuery,
} from './contract-hooks';

export type SENTBalanceQuery = ReadContractQuery & {
  /** Get the session token balance */
  getBalance: () => void;
  /** The session token balance */
  balance: ReadContractData<typeof SENTAbi, 'balanceOf', [Address]>;
};

export function useSENTBalanceQuery(
  props?: ContractReadQueryFetchOptions<
    ContractFunctionArgs<typeof SENTAbi, 'pure' | 'view', 'balanceOf'>
  >
): SENTBalanceQuery {
  const { address } = useAccount();
  const {
    data: balance,
    readContract,
    throwError,
    ...rest
  } = useContractReadQuery({
    contract: 'SENT',
    functionName: 'balanceOf',
    startEnabled: (props?.startEnabled ?? false) && Boolean(address),
    args: address ? [address] : undefined,
  });

  const getBalance = () => {
    if (!address) {
      throwError(new Error('Address is required to get balance'));
      return;
    }
    readContract({ args: [address] });
  };

  return {
    balance,
    getBalance,
    ...rest,
  };
}
