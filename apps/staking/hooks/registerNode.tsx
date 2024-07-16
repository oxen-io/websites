'use client';

import { addresses } from '@session/contracts';
import { useProxyApproval } from '@session/contracts/hooks/SENT';
import { SESSION_NODE } from '@/lib/constants';
import { useAddBLSPubKey } from '@session/contracts/hooks/ServiceNodeRewards';
import { useEffect, useMemo } from 'react';

export type ContractWriteStatus = 'idle' | 'pending' | 'error' | 'success';
export type ContractWriteUtilStatus = 'pending' | 'error' | 'success';

export enum REGISTER_STAGE {
  APPROVE,
  SIMULATE,
  WRITE,
  TRANSACTION,
  DONE,
}

const useRegisterStage = ({
  approveWriteStatus,
  addBLSSimulateStatus,
  addBLSWriteStatus,
  addBLSTransactionStatus,
}: {
  approveWriteStatus: ContractWriteStatus;
  addBLSSimulateStatus: ContractWriteUtilStatus;
  addBLSWriteStatus: ContractWriteStatus;
  addBLSTransactionStatus: ContractWriteUtilStatus;
}) => {
  const stage = useMemo(() => {
    if (
      approveWriteStatus === 'success' &&
      addBLSSimulateStatus === 'success' &&
      addBLSWriteStatus === 'success' &&
      addBLSTransactionStatus === 'success'
    ) {
      return REGISTER_STAGE.DONE;
    }

    if (
      approveWriteStatus === 'success' &&
      addBLSSimulateStatus === 'success' &&
      addBLSWriteStatus === 'success' &&
      addBLSTransactionStatus !== 'success'
    ) {
      return REGISTER_STAGE.TRANSACTION;
    }

    if (
      approveWriteStatus === 'success' &&
      addBLSSimulateStatus === 'success' &&
      addBLSWriteStatus !== 'success' &&
      addBLSTransactionStatus !== 'success'
    ) {
      return REGISTER_STAGE.WRITE;
    }

    if (
      approveWriteStatus === 'success' &&
      addBLSSimulateStatus !== 'success' &&
      addBLSWriteStatus !== 'success' &&
      addBLSTransactionStatus !== 'success'
    ) {
      return REGISTER_STAGE.SIMULATE;
    }

    if (
      approveWriteStatus !== 'success' &&
      addBLSSimulateStatus !== 'success' &&
      addBLSWriteStatus !== 'success' &&
      addBLSTransactionStatus !== 'success'
    ) {
      return REGISTER_STAGE.APPROVE;
    }
    return REGISTER_STAGE.APPROVE;
  }, [approveWriteStatus, addBLSSimulateStatus, addBLSWriteStatus, addBLSTransactionStatus]);

  const subStage = useMemo(() => {
    switch (stage) {
      case REGISTER_STAGE.APPROVE:
        return approveWriteStatus;
      case REGISTER_STAGE.SIMULATE:
        return addBLSSimulateStatus;
      case REGISTER_STAGE.WRITE:
        return addBLSWriteStatus;
      case REGISTER_STAGE.TRANSACTION:
        return addBLSTransactionStatus;
      default:
        return 'pending';
    }
  }, [stage, approveWriteStatus, addBLSSimulateStatus, addBLSWriteStatus, addBLSTransactionStatus]);

  return { stage, subStage };
};

export default function useRegisterNode({
  blsPubKey,
  blsSignature,
  nodePubKey,
  userSignature,
}: {
  blsPubKey: string;
  blsSignature: string;
  nodePubKey: string;
  userSignature: string;
}) {
  const { approve, writeStatus: approveWriteStatus } = useProxyApproval({
    contractAddress: addresses.ServiceNodeRewards.testnet,
    tokenAmount: BigInt(SESSION_NODE.FULL_STAKE_AMOUNT),
  });

  const {
    addBLSPubKey,
    writeStatus: addBLSWriteStatus,
    transactionStatus: addBLSTransactionStatus,
    simulateStatus: addBLSSimulateStatus,
  } = useAddBLSPubKey({
    blsPubKey,
    blsSignature,
    nodePubKey,
    userSignature,
  });

  const { stage, subStage } = useRegisterStage({
    approveWriteStatus,
    addBLSSimulateStatus,
    addBLSWriteStatus,
    addBLSTransactionStatus,
  });

  const registerAndStake = () => {
    approve();
  };

  useEffect(() => {
    if (approveWriteStatus === 'success') {
      addBLSPubKey();
    }
  }, [approveWriteStatus]);

  return {
    registerAndStake,
    stage,
    subStage,
  };
}
