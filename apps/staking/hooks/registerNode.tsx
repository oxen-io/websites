'use client';

import { addresses } from '@session/contracts';
import { useProxyApproval } from '@session/contracts/hooks/SENT';
import { SESSION_NODE, TOAST } from '@/lib/constants';
import { useAddBLSPubKey } from '@session/contracts/hooks/ServiceNodeRewards';
import { useEffect, useMemo } from 'react';
import { toast } from '@session/ui/lib/sonner';
import { collapseString } from '@session/util/string';
import type { SimulateContractErrorType, WriteContractErrorType } from 'viem';
import { isProduction } from '@/lib/env';
import { useTranslations } from 'next-intl';

export type ContractWriteStatus = 'idle' | 'pending' | 'error' | 'success';
export type ContractWriteUtilStatus = 'pending' | 'error' | 'success';

export enum REGISTER_STAGE {
  APPROVE,
  SIMULATE,
  WRITE,
  TRANSACTION,
  JOIN,
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
      return REGISTER_STAGE.JOIN;
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
  const dictionary = useTranslations('actionModules.register.stage');
  const {
    approve,
    writeStatus: approveWriteStatus,
    error: approveWriteError,
  } = useProxyApproval({
    // TODO: Create network provider to handle network specific logic
    contractAddress: addresses.ServiceNodeRewards.testnet,
    tokenAmount: BigInt(SESSION_NODE.FULL_STAKE_AMOUNT),
  });

  const {
    addBLSPubKey,
    writeStatus: addBLSWriteStatus,
    transactionStatus: addBLSTransactionStatus,
    simulateStatus: addBLSSimulateStatus,
    simulateError,
    writeError,
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

  // NOTE: Automatically triggers the write stage once the approval has succeeded
  useEffect(() => {
    if (approveWriteStatus === 'success') {
      addBLSPubKey();
    }
  }, [approveWriteStatus]);

  const handleError = (error: Error | SimulateContractErrorType | WriteContractErrorType) => {
    console.error(error);
    if (error.message && !isProduction) {
      toast.error(
        collapseString(error.message, TOAST.ERROR_COLLAPSE_LENGTH, TOAST.ERROR_COLLAPSE_LENGTH)
      );
    }
  };

  /**
   * NOTE: All of these useEffects are required to inform the user of errors via the toaster
   */
  useEffect(() => {
    if (simulateError) {
      handleError(simulateError);
      toast.error(dictionary('simulate.errorTooltip'));
    }
  }, [simulateError]);

  useEffect(() => {
    if (approveWriteError) {
      handleError(approveWriteError);
      toast.error(dictionary('approve.errorTooltip'));
    }
  }, [approveWriteError]);

  useEffect(() => {
    if (writeError) {
      handleError(writeError);
      toast.error(dictionary('write.errorTooltip'));
    }
  }, [writeError]);

  return {
    registerAndStake,
    stage,
    subStage,
  };
}
