'use client';

import { Address, ContractFunctionArgs } from 'viem';
import { useAccount } from 'wagmi';
import { ReadContractData } from 'wagmi/query';
import { SENTAbi } from '../abis';
import {
  CONTRACT_READ_STATUS,
  ContractReadQueryFetchOptions,
  ReadContractQuery,
  useContractReadQuery,
  useContractWriteQuery,
} from './contract-hooks';
import type { WriteContractErrorType } from 'wagmi/actions';
import type { ContractWriteStatus } from './ServiceNodeRewards';
import { CHAIN, chains } from '../chains';
import { useEffect, useMemo, useState } from 'react';
import { isProduction } from '@session/util/env';

export type SENTBalanceQuery = ReadContractQuery & {
  /** Get the session token balance */
  getBalance: () => void;
  /** The session token balance */
  balance: ReadContractData<typeof SENTAbi, 'balanceOf', [Address]>;
};

export function useSENTBalanceQuery({
  chainId,
  startEnabled,
}: ContractReadQueryFetchOptions<
  ContractFunctionArgs<typeof SENTAbi, 'pure' | 'view', 'balanceOf'>
>): SENTBalanceQuery {
  const { address } = useAccount();
  const {
    data: balance,
    readContract,
    throwError,
    ...rest
  } = useContractReadQuery({
    contract: 'SENT',
    functionName: 'balanceOf',
    startEnabled: startEnabled && !!address,
    args: address ? [address] : undefined,
    chainId,
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

export type SENTAllowanceQuery = ReadContractQuery & {
  /** Get the session token allowance */
  getAllowance: () => void;
  /** The session token allowance for a contract */
  allowance: ReadContractData<typeof SENTAbi, 'allowance', [Address, Address]>;
};

export function useAllowanceQuery({
  contractAddress,
  chainId,
}: Omit<
  ContractReadQueryFetchOptions<ContractFunctionArgs<typeof SENTAbi, 'pure' | 'view', 'allowance'>>,
  'startEnabled' | 'args'
> & { contractAddress: Address }): SENTAllowanceQuery {
  const { address } = useAccount();
  const {
    data: allowance,
    readContract,
    throwError,
    ...rest
  } = useContractReadQuery({
    contract: 'SENT',
    functionName: 'allowance',
    chainId: chainId,
  });

  const getAllowance = () => {
    if (!address) {
      throwError(new Error('Address is required to get balance'));
      return;
    }
    if (!contractAddress) {
      throwError(new Error('Contract Address is required to get allowance'));
      return;
    }
    readContract({ args: [address, contractAddress] });
  };

  return {
    allowance,
    getAllowance,
    ...rest,
  };
}

export type UseProxyApprovalReturn = {
  approve: () => void;
  status: ContractWriteStatus;
  error: WriteContractErrorType | Error | null;
};

export function useProxyApproval({
  contractAddress,
  tokenAmount,
}: {
  contractAddress: Address;
  tokenAmount: bigint;
}): UseProxyApprovalReturn {
  const [hasEnoughAllowance, setHasEnoughAllowance] = useState<boolean>(false);
  const { address } = useAccount();
  const {
    allowance,
    getAllowance,
    status: readStatus,
  } = useAllowanceQuery({
    contractAddress,
    chainId: chains[CHAIN.TESTNET].id,
  });

  const { writeContract, error, writeStatus } = useContractWriteQuery({
    contract: 'SENT',
    functionName: 'approve',
    chainId: chains[CHAIN.TESTNET].id,
  });

  const approve = () => {
    getAllowance();
  };

  const approveWrite = () => {
    if (readStatus !== CONTRACT_READ_STATUS.SUCCESS) {
      throw new Error('Checking if current allowance is sufficient');
    }

    if (allowance >= tokenAmount) {
      setHasEnoughAllowance(true);
      if (!isProduction()) {
        console.debug(
          `Allowance for ${address} on contract ${contractAddress} is sufficient: ${allowance}`
        );
      }
      return;
    }
    writeContract({
      args: [contractAddress, tokenAmount],
    });
  };

  const status = useMemo(() => {
    if (readStatus === CONTRACT_READ_STATUS.SUCCESS && hasEnoughAllowance) {
      return 'success';
    }

    if (!hasEnoughAllowance) {
      return writeStatus;
    }
    if (readStatus === CONTRACT_READ_STATUS.PENDING) {
      return 'idle';
    } else {
      return writeStatus;
    }
  }, [readStatus, writeStatus, hasEnoughAllowance]);

  useEffect(() => {
    if (readStatus === CONTRACT_READ_STATUS.SUCCESS) {
      approveWrite();
    }
  }, [allowance, readStatus]);

  return { approve, status, error };
}
