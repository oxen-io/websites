'use client';

import { Address, SimulateContractErrorType, TransactionExecutionErrorType } from 'viem';
import { useAccount } from 'wagmi';
import { ReadContractData } from 'wagmi/query';
import { SENTAbi } from '../abis';
import { type ContractReadQueryProps, useContractReadQuery } from './useContractReadQuery';
import type { WriteContractErrorType } from 'wagmi/actions';
import { useEffect, useMemo, useState } from 'react';
import { isProduction } from '@session/util/env';
import { formatBigIntTokenValue, formatNumber } from '@session/util/maths';
import { SENT_DECIMALS, SENT_SYMBOL } from '../constants';
import {
  GenericContractStatus,
  useContractWriteQuery,
  type WriteContractStatus,
} from './useContractWriteQuery';
import { useChain } from './useChain';
import type { CHAIN } from '../chains';

export const formatSENTBigInt = (value?: bigint, decimals?: number, hideSymbol?: boolean) =>
  `${value ? formatBigIntTokenValue(value, SENT_DECIMALS, decimals) : 0}${hideSymbol ? '' : ` ${SENT_SYMBOL}`}`;

export const formatSENTNumber = (value?: number, decimals?: number, hideSymbol?: boolean) =>
  `${value ? formatNumber(value, decimals) : 0}${hideSymbol ? '' : ` ${SENT_SYMBOL}`}`;

type SENTBalance = ReadContractData<typeof SENTAbi, 'balanceOf', [Address]>;

export type SENTBalanceQuery = ContractReadQueryProps & {
  /** The session token balance */
  balance: SENTBalance;
};

export function useSENTBalanceQuery({
  address,
  overrideChain,
}: {
  address?: Address;
  overrideChain?: CHAIN;
}): SENTBalanceQuery {
  const chain = useChain();

  const { data: balance, ...rest } = useContractReadQuery({
    contract: 'SENT',
    functionName: 'balanceOf',
    args: [address!],
    enabled: !!address,
    chain: overrideChain ?? chain,
  });

  return {
    balance,
    ...rest,
  };
}

type SENTAllowance = ReadContractData<typeof SENTAbi, 'allowance', [Address, Address]>;

export type SENTAllowanceQuery = ContractReadQueryProps & {
  /** The session token allowance for a contract */
  allowance: SENTAllowance;
};

export function useAllowanceQuery({
  contractAddress,
}: {
  contractAddress: Address;
}): SENTAllowanceQuery {
  const { address } = useAccount();
  const chain = useChain();
  const { data: allowance, ...rest } = useContractReadQuery({
    contract: 'SENT',
    functionName: 'allowance',
    args: [address!, contractAddress],
    enabled: !!address,
    chain,
  });

  return {
    allowance,
    ...rest,
  };
}

export type UseProxyApprovalReturn = {
  approve: () => void;
  approveWrite: () => void;
  resetApprove: () => void;
  status: WriteContractStatus;
  readStatus: GenericContractStatus;
  simulateError: SimulateContractErrorType | Error | null;
  writeError: WriteContractErrorType | Error | null;
  transactionError: TransactionExecutionErrorType | Error | null;
};

export function useProxyApproval({
  contractAddress,
  tokenAmount,
}: {
  contractAddress: Address;
  tokenAmount: bigint;
}): UseProxyApprovalReturn {
  const [hasEnoughAllowance, setHasEnoughAllowance] = useState<boolean>(false);
  const [allowanceReadStatusOverride, setAllowanceReadStatusOverride] =
    useState<GenericContractStatus | null>(null);

  const chain = useChain();
  const { address } = useAccount();
  const {
    allowance,
    status: readStatusRaw,
    refetch: refetchRaw,
  } = useAllowanceQuery({
    contractAddress,
  });

  const refetchAllowance = async () => {
    setAllowanceReadStatusOverride('pending');
    await refetchRaw();
    setAllowanceReadStatusOverride(null);
  };

  const readStatus = useMemo(
    () => allowanceReadStatusOverride ?? readStatusRaw,
    [allowanceReadStatusOverride, readStatusRaw]
  );

  const {
    simulateAndWriteContract,
    resetContract,
    contractCallStatus,
    simulateError,
    writeError,
    transactionError,
  } = useContractWriteQuery({
    contract: 'SENT',
    functionName: 'approve',
    chain,
  });

  const approve = () => {
    if (allowance) {
      void refetchAllowance();
    }
  };

  const resetApprove = () => {
    resetContract();
  };

  const approveWrite = () => {
    if (readStatus !== 'success') {
      throw new Error('Checking if current allowance is sufficient');
    }

    if (tokenAmount > BigInt(0) && allowance >= tokenAmount) {
      setHasEnoughAllowance(true);
      if (!isProduction()) {
        console.debug(
          `Allowance for ${address} on contract ${contractAddress} is sufficient: ${allowance}`
        );
      }
      return;
    }

    simulateAndWriteContract([contractAddress, tokenAmount]);
  };

  const status = useMemo(() => {
    if (readStatus === 'success' && hasEnoughAllowance) {
      return 'success';
    }

    if (!hasEnoughAllowance) {
      return contractCallStatus;
    }

    if (readStatus === 'pending') {
      return 'pending';
    } else {
      return contractCallStatus;
    }
  }, [readStatus, contractCallStatus, hasEnoughAllowance]);

  useEffect(() => {
    if (readStatus === 'success' && tokenAmount > BigInt(0)) {
      approveWrite();
    }
  }, [readStatus]);

  return {
    approve,
    approveWrite,
    resetApprove,
    status,
    readStatus,
    simulateError,
    writeError,
    transactionError,
  };
}
