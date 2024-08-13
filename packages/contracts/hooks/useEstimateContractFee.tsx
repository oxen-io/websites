import {
  type Abi,
  type Address,
  type Chain,
  type ContractFunctionArgs,
  type ContractFunctionName,
  createPublicClient,
  http,
} from 'viem';
import { useMemo, useState } from 'react';
import { addresses, type ContractName } from '../constants';
import { ContractAbis, Contracts } from '../abis';
import { type CHAIN, chains } from '../chains';
import type { WriteContractFunction, WriteContractStatus } from './useContractWriteQuery';

const initPublicClient = (chain: Chain) =>
  createPublicClient({
    chain,
    transport: http(),
  });

type UseEstimateContractFeeProps = {
  chain: CHAIN;
  executorAddress?: Address;
};

export const useEstimateContractFee = <
  T extends ContractName,
  C extends ContractAbis[T],
  FName extends ContractFunctionName<C, 'nonpayable' | 'payable'>,
  Args extends ContractFunctionArgs<C, 'nonpayable' | 'payable', FName>,
>({
  contract,
  functionName,
  chain,
  executorAddress,
}: {
  contract: T;
  functionName: FName;
} & UseEstimateContractFeeProps) => {
  const [gasAmountEstimate, setGasAmountEstimate] = useState<bigint | null>(null);
  const [gasPrice, setGasPrice] = useState<bigint | null>(null);
  const [executed, setExecuted] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const publicClient = useMemo(() => initPublicClient(chains[chain]), [chain]);
  const address = useMemo(() => addresses[contract][chain], [contract, chain]);
  const abi = useMemo(() => Contracts[contract], [contract]);

  const getGasPrice = async () => {
    const gasPrice = await publicClient.getGasPrice();
    setGasPrice(gasPrice);
  };

  const estimateGasAmount: WriteContractFunction<Args> = async (args) => {
    setExecuted(true);
    try {
      const gas = await publicClient.estimateContractGas({
        address,
        abi: abi as Abi,
        functionName,
        account: executorAddress,
        ...(args ? { args: args as ContractFunctionArgs } : undefined),
      });
      setGasAmountEstimate(gas);
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      }
    }
  };

  const fee = useMemo(
    () => (gasAmountEstimate && gasPrice ? gasAmountEstimate * gasPrice : null),
    [gasAmountEstimate, gasPrice]
  );

  const status: WriteContractStatus = useMemo(() => {
    if (error) return 'error';
    if (gasAmountEstimate !== null) return 'success';
    return executed ? 'pending' : 'idle';
  }, [error, gasAmountEstimate, executed]);

  return { fee, estimateGasAmount, getGasPrice, gasAmountEstimate, gasPrice, status, error };
};
