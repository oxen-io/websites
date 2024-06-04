'use client';
import { useAccount } from 'wagmi';
import { SENTAbi } from '../abis';
import { Address, ContractFunctionArgs, formatUnits } from 'viem';
import { ReadContractQuery, useContractReadQuery } from './contract-hooks';
import { ReadContractData } from 'wagmi/query';

export const SENT_DECIMALS = 9;

export function formatSENT(value: bigint): string {
  return formatUnits(value, SENT_DECIMALS);
}

export type SENTBalanceQuery = ReadContractQuery & {
  /** Get the reward rate */
  getBalance: () => void;
  /** The reward rate */
  balance: ReadContractData<typeof SENTAbi, 'balanceOf', [Address]>;
};

export function useSENTBalanceQuery(
  props?:
    | {
        startEnabled: never;
        args: never;
      }
    | {
        startEnabled: boolean;
        args: ContractFunctionArgs<typeof SENTAbi, 'pure' | 'view', 'balanceOf'>;
      }
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
      throwError(new Error('Address is required to get reward rate'));
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
