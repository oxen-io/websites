import type {
  Abi,
  ContractFunctionArgs,
  ContractFunctionName,
  SimulateContractErrorType,
  TransactionExecutionErrorType,
} from 'viem';
import type { WriteContractErrorType } from 'wagmi/actions';
import { CHAIN, chains } from '../chains';
import { addresses, type ContractName } from '../constants';
import { ContractAbis, Contracts } from '../abis';
import { useEffect, useMemo, useState } from 'react';
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { useEstimateContractFee } from './useEstimateContractFee';

export type GenericContractStatus = 'error' | 'pending' | 'success';

export type SimulateContractStatus = GenericContractStatus;
export type TransactionContractStatus = GenericContractStatus;
export type WriteContractStatus = GenericContractStatus | 'idle';

export type WriteContractFunction<Args> = (args?: Args) => void;

export type ContractWriteQueryProps = {
  /** Execute getting the fee estimation for the contract write */
  estimateContractWriteFee: () => void;
  /** Re-fetch the gas price and units of gas needed to write the contract */
  refetchContractWriteFeeEstimate: () => void;
  /** Estimate gas the amount of gas to make the contract write */
  gasAmountEstimate: bigint | null;
  /** The current price of gas */
  gasPrice: bigint | null;
  /** The estimated fee to write to the contract */
  fee: bigint | null;
  /** Status of the contract simulation */
  simulateStatus: SimulateContractStatus;
  /** Status of the contract write */
  writeStatus: WriteContractStatus;
  /** Status of the contract transaction */
  transactionStatus: TransactionContractStatus;
  /** Contract simulation error */
  simulateError: Error | SimulateContractErrorType | null;
  /** Contract write error */
  writeError: Error | WriteContractErrorType | null;
  /** Contract transaction error */
  transactionError: Error | TransactionExecutionErrorType | null;
  /** Estimate fee status */
  estimateFeeStatus: WriteContractStatus;
  /** Estimate fee error */
  estimateFeeError: Error | null;
};

export type UseContractWrite<Args> = ContractWriteQueryProps & {
  /** Simulate the contract write then write to the contract if the simulation is successful */
  simulateAndWriteContract: WriteContractFunction<Args>;
};

export type ContractWriteQueryFetchOptions = {
  /** Chain the contract is on */
  chain: CHAIN;
};

export function useContractWriteQuery<
  T extends ContractName,
  C extends ContractAbis[T],
  FName extends ContractFunctionName<C, 'nonpayable' | 'payable'>,
  Args extends ContractFunctionArgs<C, 'nonpayable' | 'payable', FName>,
>({
  contract,
  functionName,
  defaultArgs,
  chain,
}: {
  contract: T;
  defaultArgs?: Args;
  functionName: FName;
} & ContractWriteQueryFetchOptions): UseContractWrite<Args> {
  const { address: executorAddress } = useAccount();
  const [estimateGasEnabled, setEstimateGasEnabled] = useState<boolean>(false);
  const [simulateEnabled, setSimulateEnabled] = useState<boolean>(false);
  const [contractArgs, setContractArgs] = useState<Args | undefined>(defaultArgs);

  const { data: hash, error: writeError, status: writeStatus, writeContract } = useWriteContract();
  const { error: transactionError, status: transactionStatus } = useWaitForTransactionReceipt({
    hash,
  });

  const contractDetails = useMemo(() => {
    return {
      address: addresses[contract][chain],
      abi: Contracts[contract] as Abi,
      functionName,
      args: contractArgs as ContractFunctionArgs,
    };
  }, [contract, chain, functionName, contractArgs]);

  const {
    data,
    status: simulateStatus,
    error: simulateError,
    refetch,
  } = useSimulateContract({
    ...contractDetails,
    query: { enabled: simulateEnabled },
    chainId: chains[chain].id,
  });

  const {
    estimateGasAmount,
    gasAmountEstimate,
    getGasPrice,
    gasPrice,
    fee,
    status: estimateFeeStatus,
    error: estimateFeeError,
  } = useEstimateContractFee({
    contract,
    functionName,
    chain,
    executorAddress,
  });

  const estimateContractWriteFee = () => setEstimateGasEnabled(true);

  const refetchContractWriteFeeEstimate = () => {
    void getGasPrice();
    void estimateGasAmount(contractArgs);
  };

  const simulateAndWriteContract: WriteContractFunction<Args> = (args) => {
    if (args) setContractArgs(args);

    setSimulateEnabled(true);

    void refetch();
  };

  useEffect(() => {
    if (simulateStatus === 'success' && data?.request) {
      writeContract(data.request);
    }
  }, [simulateStatus, data?.request]);

  useEffect(() => {
    if (estimateGasEnabled) {
      void refetchContractWriteFeeEstimate();
    }
  }, [estimateGasEnabled]);

  useEffect(() => setContractArgs(defaultArgs), [defaultArgs]);

  return {
    simulateAndWriteContract,
    estimateContractWriteFee,
    refetchContractWriteFeeEstimate,
    fee,
    gasAmountEstimate,
    gasPrice,
    simulateStatus,
    writeStatus,
    transactionStatus,
    simulateError,
    writeError,
    transactionError,
    estimateFeeStatus,
    estimateFeeError,
  };
}
