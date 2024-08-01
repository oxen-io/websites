'use client';

import type { ReadContractData } from 'wagmi/query';
import { ServiceNodeRewardsAbi } from '../abis';
import { type ContractReadQueryProps, useContractReadQuery } from './useContractReadQuery';
import { useMemo } from 'react';
import { type ContractWriteQueryProps, useContractWriteQuery } from './useContractWriteQuery';
import { useChain } from './useChain';

export type TotalNodesQuery = ContractReadQueryProps & {
  /** Update rewards balance */
  getTotalNodes: () => void;
  /** The total number of nodes */
  totalNodes: ReadContractData<typeof ServiceNodeRewardsAbi, 'totalNodes', []>;
};

export function useTotalNodesQuery(): TotalNodesQuery {
  const chain = useChain();
  const {
    data: totalNodes,
    readContract,
    ...rest
  } = useContractReadQuery({
    contract: 'ServiceNodeRewards',
    functionName: 'totalNodes',
    startEnabled: true,
    chain,
  });

  return {
    totalNodes,
    getTotalNodes: readContract,
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

export type UseAddBLSPubKeyReturn = ContractWriteQueryProps & {
  addBLSPubKey: () => void;
};

export function useAddBLSPubKey({
  blsPubKey,
  blsSignature,
  nodePubKey,
  userSignature,
  fee = 0,
}: {
  blsPubKey: string;
  blsSignature: string;
  nodePubKey: string;
  userSignature: string;
  fee?: number;
}): UseAddBLSPubKeyReturn {
  const chain = useChain();
  const defaultArgs = useMemo(() => {
    const encodedBlsPubKey = encodeBlsPubKey(blsPubKey);
    const encodedBlsSignature = encodeBlsSignature(blsSignature);
    const { pubKey } = encodeED25519PubKey(nodePubKey);
    const { sigs0, sigs1 } = encodeED25519Signature(userSignature);

    const encodedNodeParams = {
      serviceNodePubkey: pubKey,
      serviceNodeSignature1: sigs0,
      serviceNodeSignature2: sigs1,
      fee,
    };

    return [encodedBlsPubKey, encodedBlsSignature, encodedNodeParams, []] as const;
  }, [blsPubKey, blsSignature, nodePubKey, userSignature]);

  const { simulateAndWriteContract, ...rest } = useContractWriteQuery({
    contract: 'ServiceNodeRewards',
    functionName: 'addBLSPublicKey',
    chain,
    defaultArgs,
  });

  return {
    addBLSPubKey: simulateAndWriteContract,
    ...rest,
  };
}
