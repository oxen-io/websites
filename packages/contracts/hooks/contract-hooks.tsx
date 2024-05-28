import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { Abi, ContractFunctionArgs, ContractFunctionName, ReadContractErrorType } from 'viem';
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import type { WaitForTransactionReceiptErrorType, WriteContractErrorType } from 'wagmi/actions';
import { ReadContractData } from 'wagmi/query';
import { ContractAbis, Contracts } from '../abis';
import { CHAIN } from '../chains';
import { addresses, type ContractName } from '../constants';

/**
 * The read status of a contract.
 */
export enum CONTRACT_READ_STATUS {
  /** The contract read is pending, this is the initial state when the query exists but has not begun to run. */
  PENDING,
  /** The contract read is loading. */
  LOADING,
  /** The contract read was successful. */
  SUCCESS,
  /** The contract read had an error. */
  ERROR,
}

/**
 * Parses the contract read status based on the provided flags.
 *
 * @param flags - The flags indicating the status of the contract read operation.
 * @param flags.isPending - Indicates if the contract read operation is pending.
 * @param flags.isLoading - Indicates if the contract read operation is loading.
 * @param flags.isSuccess - Indicates if the contract read operation is successful.
 * @param flags.isError - Indicates if the contract read operation encountered an error.
 * @returns The contract read status.
 */
const parseContractReadStatus = ({
  isPending,
  isLoading,
  isSuccess,
  isError,
}: {
  isPending: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}): CONTRACT_READ_STATUS => {
  if (isError) return CONTRACT_READ_STATUS.ERROR;
  if (isSuccess) return CONTRACT_READ_STATUS.SUCCESS;
  if (isLoading) return CONTRACT_READ_STATUS.LOADING;
  if (isPending) return CONTRACT_READ_STATUS.PENDING;
  return CONTRACT_READ_STATUS.PENDING;
};

/**
 * Merges an array of contract read statuses into a single status.
 * If the array contains an ERROR status, the function returns ERROR.
 * Otherwise, it returns the minimum status value from the array.
 *
 * @param statuses - An array of contract read statuses.
 * @returns The merged contract read status.
 */
export const mergeContractReadStatuses = (
  statuses: Array<CONTRACT_READ_STATUS>
): CONTRACT_READ_STATUS => {
  if (statuses.includes(CONTRACT_READ_STATUS.ERROR)) return CONTRACT_READ_STATUS.ERROR;
  return Math.min(...statuses);
};

type WriteContractFunction<Args> = ({ args }: { args: Args }) => void;
type ReadContractFunction<Args> = ({ args }: { args: Args }) => void;

export type ContractQuery = {
  /** Is the contract write pending */
  isPending: boolean;
  /** Was there an error with the transaction */
  isError: boolean;
  /** The error if an error occurred */
  error: Error | WriteContractErrorType | WaitForTransactionReceiptErrorType | null;
};

export type WriteContractQuery = ContractQuery & {
  /** Is the transaction being confirmed */
  isConfirming: boolean;
  /** Is the transaction confirmed */
  isConfirmed: boolean;
};

export type ReadContractQuery = ContractQuery & {
  /** Is the contract read pending */
  isLoading: boolean;
  /** Is the contract read successful and ready to display data*/
  isSuccess: boolean;
  /** The status of the read contract */
  status: CONTRACT_READ_STATUS;

  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<unknown, ReadContractErrorType>>;
};

export type GenericContractWriteQuery<Args> = WriteContractQuery & {
  /** Write to the contract */
  writeContract: WriteContractFunction<Args>;
  /** Throw an error */
  throwError: (error: Error) => void;
};

export type GenericContractReadQuery<Args, Data> = ReadContractQuery & {
  /** Read the contract */
  readContract: ReadContractFunction<Args>;
  /** Throw an error */
  throwError: (error: Error) => void;
  /** The data from the contract */
  data: Data;
};

export function useContractWriteQuery<
  T extends ContractName,
  C extends ContractAbis[T],
  FName extends ContractFunctionName<C, 'nonpayable' | 'payable'>,
  Args extends ContractFunctionArgs<C, 'nonpayable' | 'payable', FName>,
>({
  contract,
  functionName,
}: {
  contract: T;
  functionName: FName;
}): GenericContractWriteQuery<Args> {
  const [internalError, setInternalError] = useState<Error | null>(null);
  const {
    writeContract: write,
    isPending,
    data: hash,
    error: writeError,
    isError: isWriteError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isTransactionError,
    error: transactionError,
  } = useWaitForTransactionReceipt({ hash });

  const isError = useMemo(
    () => internalError !== null || isWriteError || isTransactionError,
    [internalError, isWriteError, isTransactionError]
  );
  const error = useMemo(
    () => internalError ?? writeError ?? transactionError,
    [internalError, writeError, transactionError]
  );

  const abi = useMemo(() => Contracts[contract], [contract]);
  const address = useMemo(() => addresses[contract][CHAIN.TESTNET], [contract]);

  const writeContract: WriteContractFunction<Args> = ({ args }) => {
    /* if (!address) {
      setInternalError(new Error('Failed to get contract address'));
      return;
    } */
    /* 
    if (Array.isArray(args)) {
      const missingArgs: Array<number> = [];
      args.forEach((arg, index) => {
        if (arg === undefined || arg === null) {
          missingArgs.push(index);
        }
      });

      if (missingArgs.length) {
        setInternalError(new Error(`Missing arguments at index: ${missingArgs.join(', ')}`));
        return;
      }
    } */

    write({
      address: address,
      abi: abi as Abi,
      functionName: functionName,
      args: args as ContractFunctionArgs,
    });
  };

  return {
    writeContract,
    isPending,
    isConfirming,
    isConfirmed,
    isError,
    error,
    throwError: setInternalError,
  };
}

export function useContractReadQuery<
  T extends ContractName,
  C extends ContractAbis[T],
  FName extends ContractFunctionName<C, 'pure' | 'view'>,
  Args extends ContractFunctionArgs<C, 'pure' | 'view', FName>,
  Data = ReadContractData<C, FName, Args>,
>({
  contract,
  functionName,
  startEnabled = false,
  args: initialArgs,
}: {
  contract: T;
  functionName: FName;
  startEnabled?: boolean;
  args?: Args;
}): GenericContractReadQuery<Args, Data> {
  const [internalError, setInternalError] = useState<Error | null>(null);
  const [args, setArgs] = useState<Args | null>(initialArgs ?? null);
  const enabled = useMemo(() => startEnabled || args !== null, [startEnabled, args]);

  const abi = useMemo(() => Contracts[contract], [contract]);
  const address = useMemo(() => addresses[contract][CHAIN.TESTNET], [contract]);

  const {
    data,
    error: readError,
    isError: isReadError,
    isPending,
    isLoading,
    isSuccess,
    refetch,
  } = useReadContract({
    query: {
      enabled,
    },
    address: address,
    abi: abi as Abi,
    functionName: functionName,
    args: args as ContractFunctionArgs,
  });

  const readContract: WriteContractFunction<Args> = ({ args }) => {
    if (!address) {
      setInternalError(new Error('Failed to get contract address'));
      return;
    }

    if (Array.isArray(args)) {
      const missingArgs: Array<number> = [];
      args.forEach((arg, index) => {
        if (arg === undefined || arg === null) {
          missingArgs.push(index);
        }
      });

      if (missingArgs.length) {
        setInternalError(new Error(`Missing arguments at index: ${missingArgs.join(', ')}`));
        return;
      }
    }

    setArgs(args);
  };

  const isError = useMemo(
    () => internalError !== null || isReadError,
    [internalError, isReadError]
  );
  const error = useMemo(() => internalError ?? readError, [internalError, readError]);
  const status = useMemo(
    () => parseContractReadStatus({ isPending, isLoading, isSuccess, isError }),
    [isPending, isLoading, isSuccess, isError]
  );

  return {
    data: data as Data,
    readContract,
    status,
    isPending,
    isLoading,
    isSuccess,
    isError,
    error,
    throwError: setInternalError,
    refetch,
  };
}
