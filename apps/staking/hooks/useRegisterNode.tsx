'use client';

import { addresses } from '@session/contracts';
import { useProxyApproval } from '@session/contracts/hooks/SENT';
import { SESSION_NODE } from '@/lib/constants';
import { useAddBLSPubKey } from '@session/contracts/hooks/ServiceNodeRewards';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type {
  GenericContractStatus,
  WriteContractStatus,
} from '@session/contracts/hooks/useContractWriteQuery';
import { toast } from '@session/ui/lib/toast';

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
  approveWriteStatus: WriteContractStatus;
  addBLSSimulateStatus: GenericContractStatus;
  addBLSWriteStatus: WriteContractStatus;
  addBLSTransactionStatus: GenericContractStatus;
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
  const [enabled, setEnabled] = useState<boolean>(false);
  const dictionary = useTranslations('actionModules.register.stage');
  const {
    approve,
    status: approveWriteStatus,
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
    setEnabled(true);
    approve();
  };

  // NOTE: Automatically triggers the write stage once the approval has succeeded
  useEffect(() => {
    if (enabled && approveWriteStatus === 'success') {
      addBLSPubKey();
    }
  }, [enabled, approveWriteStatus]);

  /**
   * NOTE: All of these useEffects are required to inform the user of errors via the toaster
   */
  useEffect(() => {
    if (simulateError) {
      toast.handleError(simulateError);
      toast.error(dictionary('simulate.errorTooltip'));
    }
  }, [simulateError]);

  useEffect(() => {
    if (approveWriteError) {
      toast.handleError(approveWriteError);
      toast.error(dictionary('approve.errorTooltip'));
    }
  }, [approveWriteError]);

  useEffect(() => {
    if (writeError) {
      toast.handleError(writeError);
      toast.error(dictionary('write.errorTooltip'));
    }
  }, [writeError]);

  return {
    registerAndStake,
    stage,
    subStage,
    enabled,
  };
}
