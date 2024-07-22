'use client';

import { type Address, type ContractFunctionArgs, type SimulateContractErrorType } from 'viem';
import type { ReadContractData } from 'wagmi/query';
import { ServiceNodeRewardsAbi } from '../abis';
import {
  ContractReadQueryFetchOptions,
  ReadContractQuery,
  useContractReadQuery,
  useContractWriteQuery,
  WriteContractQuery,
} from './contract-hooks';
import { useSimulateContract } from 'wagmi';
import { useEffect, useMemo, useState } from 'react';
import { addresses } from '../constants';
import type { WriteContractErrorType } from 'wagmi/actions';

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
  props?: ContractReadQueryFetchOptions<
    ContractFunctionArgs<typeof ServiceNodeRewardsAbi, 'pure' | 'view', 'totalNodes'>
  >
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

const HEX_BYTES = {
  BLS_KEY_BYTES: 128,
  BLS_SIG_BYTES: 256,
  ED_25519_KEY_BYTES: 64,
  ED_25519_SIG_BYTES: 128,
};

function encodeHexToBigIntChunks(hex: string, hexBytes: number): Array<bigint> {
  if (hexBytes < 64 || hexBytes % 64 !== 0) {
    throw new Error(`hexBytes must be divisible by 2. hexBits: ${hexBytes}`);
  }

  if (hex.length !== hexBytes) {
    throw new Error(`Hex length is invalid, it must be a ${hexBytes} byte string`);
  }

  const numberOfChunks = hexBytes / 64;

  const chunks = [];

  for (let i = 0; i < numberOfChunks; i++) {
    chunks.push(hex.slice(i * 64, (i + 1) * 64));
  }

  return chunks.map((hexChunk) => BigInt(`0x${hexChunk}`));
}

const encodeBlsPubKey = (hex: string) => {
  const chunks = encodeHexToBigIntChunks(hex, HEX_BYTES.BLS_KEY_BYTES);
  const [X, Y] = chunks;
  if (chunks.length !== 2 || !X || !Y) {
    throw new Error(`BLS Pubkey improperly chunked. Expected 2 chunks, got ${chunks.length}`);
  }
  return { X, Y };
};

const encodeBlsSignature = (hex: string) => {
  const chunks = encodeHexToBigIntChunks(hex, HEX_BYTES.BLS_SIG_BYTES);
  const [sigs0, sigs1, sigs2, sigs3] = chunks;
  if (chunks.length !== 4 || !sigs0 || !sigs1 || !sigs2 || !sigs3) {
    throw new Error(`BLS Signature improperly chunked. Expected 4 chunks, got ${chunks.length}`);
  }
  return { sigs0, sigs1, sigs2, sigs3 };
};

const encodeED25519PubKey = (hex: string) => {
  const chunks = encodeHexToBigIntChunks(hex, HEX_BYTES.ED_25519_KEY_BYTES);
  const [pubKey] = chunks;
  if (chunks.length !== 1 || !pubKey) {
    throw new Error(
      `ED 25519 Public Key improperly chunked. Expected 1 chunk, got ${chunks.length}`
    );
  }
  return { pubKey };
};

const encodeED25519Signature = (hex: string) => {
  const chunks = encodeHexToBigIntChunks(hex, HEX_BYTES.ED_25519_SIG_BYTES);
  const [sigs0, sigs1] = chunks;
  if (chunks.length !== 2 || !sigs0 || !sigs1) {
    throw new Error(
      `ED 25519 Signature improperly chunked. Expected 2 chunks, got ${chunks.length}`
    );
  }
  return { sigs0, sigs1 };
};

export type ContractWriteStatus = 'idle' | 'pending' | 'error' | 'success';
export type ContractWriteUtilStatus = 'pending' | 'error' | 'success';

export type UseAddBLSPubKeyReturn = {
  addBLSPubKey: () => void;
  simulateStatus: ContractWriteUtilStatus;
  writeStatus: ContractWriteStatus;
  simulateError: SimulateContractErrorType | Error | null;
  writeError: WriteContractErrorType | Error | null;
  transactionStatus: ContractWriteUtilStatus;
};

export function useAddBLSPubKey({
  blsPubKey,
  blsSignature,
  nodePubKey,
  userSignature,
}: {
  blsPubKey: string;
  blsSignature: string;
  nodePubKey: string;
  userSignature: string;
}): UseAddBLSPubKeyReturn {
  const [simulateEnabled, setSimulateEnabled] = useState<boolean>(false);
  const {
    writeContract,
    writeStatus,
    transactionStatus,
    error: writeError,
  } = useContractWriteQuery({
    contract: 'ServiceNodeRewards',
    functionName: 'addBLSPublicKey',
  });

  const contractArgs = useMemo(() => {
    const encodedBlsPubKey = encodeBlsPubKey(blsPubKey);
    const encodedBlsSignature = encodeBlsSignature(blsSignature);
    const { pubKey } = encodeED25519PubKey(nodePubKey);
    const { sigs0, sigs1 } = encodeED25519Signature(userSignature);

    const encodedNodeParams = {
      serviceNodePubkey: pubKey,
      serviceNodeSignature1: sigs0,
      serviceNodeSignature2: sigs1,
      fee: 0,
    };

    return [encodedBlsPubKey, encodedBlsSignature, encodedNodeParams, []] as const;
  }, [blsPubKey, blsSignature, nodePubKey, userSignature]);

  const {
    data,
    status: simulateStatus,
    refetch,
    error: simulateError,
  } = useSimulateContract({
    abi: ServiceNodeRewardsAbi,
    address: addresses.ServiceNodeRewards.testnet,
    functionName: 'addBLSPublicKey',
    query: { enabled: simulateEnabled },
    args: contractArgs,
  });

  const addBLSPubKey = () => {
    setSimulateEnabled(true);
    void refetch();
  };

  useEffect(() => {
    if (simulateStatus === 'success' && data?.request) {
      writeContract(data.request);
      addBLSPubKey();
    }
  }, [simulateStatus, data?.request]);

  return {
    addBLSPubKey,
    simulateStatus,
    writeStatus,
    simulateError,
    writeError,
    transactionStatus,
  };
}
