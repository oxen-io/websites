'use client';

import { Address } from 'viem';
import { useAccount } from 'wagmi';
import { ReadContractData } from 'wagmi/query';
import { SENTAbi } from '../abis';
import { type ContractReadQueryProps, useContractReadQuery } from './useContractReadQuery';
import type { WriteContractErrorType } from 'wagmi/actions';
import { useEffect, useMemo, useState } from 'react';
import { isProduction } from '@session/util/env';
import { formatBigIntTokenValue, formatNumber } from '@session/util/maths';
import { SENT_DECIMALS, SENT_SYMBOL } from '../constants';
import { useContractWriteQuery, type WriteContractStatus } from './useContractWriteQuery';
import { useChain } from './useChain';
import type { CHAIN } from '../chains';

export const formatSENTBigInt = (value?: bigint, decimals?: number, hideSymbol?: boolean) =>
  `${value ? formatBigIntTokenValue(value, SENT_DECIMALS, decimals) : 0}${hideSymbol ? '' : ` ${SENT_SYMBOL}`}`;

export const formatSENTNumber = (value?: number, decimals?: number, hideSymbol?: boolean) =>
  `${value ? formatNumber(value, decimals) : 0}${hideSymbol ? '' : ` ${SENT_SYMBOL}`}`;

type SENTBalance = ReadContractData<typeof SENTAbi, 'balanceOf', [Address]>;

export type SENTBalanceQuery = ContractReadQueryProps & {
  /** Get the session token balance */
  getBalance: () => void;
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
  const {
    data: balance,
    readContract,
    ...rest
  } = useContractReadQuery({
    contract: 'SENT',
    functionName: 'balanceOf',
    defaultArgs: [address!],
    startEnabled: !!address,
    chain: overrideChain ?? chain,
  });

  return {
    balance,
    getBalance: readContract,
    ...rest,
  };
}

type SENTAllowance = ReadContractData<typeof SENTAbi, 'allowance', [Address, Address]>;

export type SENTAllowanceQuery = ContractReadQueryProps & {
  /** Get the session token allowance */
  getAllowance: () => void;
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
  const {
    data: allowance,
    readContract,
    ...rest
  } = useContractReadQuery({
    contract: 'SENT',
    functionName: 'allowance',
    defaultArgs: [address!, contractAddress],
    chain,
  });

  return {
    allowance,
    getAllowance: readContract,
    ...rest,
  };
}

export type UseProxyApprovalReturn = {
  approve: () => void;
  status: WriteContractStatus;
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
  const chain = useChain();
  const { address } = useAccount();
  const {
    allowance,
    getAllowance,
    status: readStatus,
  } = useAllowanceQuery({
    contractAddress,
  });

  const { simulateAndWriteContract, writeStatus, simulateError, writeError } =
    useContractWriteQuery({
      contract: 'SENT',
      functionName: 'approve',
      chain,
    });

  const approve = () => {
    getAllowance();
  };

  const approveWrite = () => {
    if (readStatus !== 'success') {
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

    simulateAndWriteContract([contractAddress, tokenAmount]);
  };

  const status = useMemo(() => {
    if (readStatus === 'success' && hasEnoughAllowance) {
      return 'success';
    }

    if (!hasEnoughAllowance) {
      return writeStatus;
    }

    if (readStatus === 'pending') {
      return 'idle';
    } else {
      return writeStatus;
    }
  }, [readStatus, writeStatus, hasEnoughAllowance]);

  const error = useMemo(() => simulateError ?? writeError, [simulateError, writeError]);

  useEffect(() => {
    if (readStatus === 'success') {
      approveWrite();
    }
  }, [allowance, readStatus]);

  return { approve, status, error };
}
