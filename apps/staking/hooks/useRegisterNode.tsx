'use client';

import { addresses } from '@session/contracts';
import { useProxyApproval } from '@session/contracts/hooks/SENT';
import { useAddBLSPubKey } from '@session/contracts/hooks/ServiceNodeRewards';
import { useEffect, useMemo, useState } from 'react';
import {
  formatAndHandleLocalizedContractErrorMessages,
  parseContractStatusToProgressStatus,
} from '@/lib/contracts';
import { useTranslations } from 'next-intl';

export default function useRegisterNode({
  blsPubKey,
  blsSignature,
  nodePubKey,
  userSignature,
  stakeAmount,
}: {
  blsPubKey: string;
  blsSignature: string;
  nodePubKey: string;
  userSignature: string;
  stakeAmount: bigint;
}) {
  const [enabled, setEnabled] = useState<boolean>(false);

  const stageDictKey = 'actionModules.register.stage' as const;
  const dictionary = useTranslations(stageDictKey);
  const dictionaryGeneral = useTranslations('general');

  const {
    approve,
    approveWrite,
    resetApprove,
    status: approveWriteStatusRaw,
    readStatus,
    writeError: approveWriteError,
    simulateError: approveSimulateError,
    transactionError: approveTransactionError,
  } = useProxyApproval({
    // TODO: Create network provider to handle network specific logic
    contractAddress: addresses.ServiceNodeRewards.testnet,
    tokenAmount: stakeAmount,
  });

  const {
    addBLSPubKey,
    contractCallStatus: addBLSStatusRaw,
    simulateError: addBLSSimulateError,
    writeError: addBLSWriteError,
    transactionError: addBLSTransactionError,
  } = useAddBLSPubKey({
    blsPubKey,
    blsSignature,
    nodePubKey,
    userSignature,
  });

  const registerAndStake = () => {
    setEnabled(true);
    approve();
  };

  const resetRegisterAndStake = () => {
    if (addBLSStatusRaw !== 'idle') return;
    setEnabled(false);
    resetApprove();
    approveWrite();
  };

  const approveErrorMessage = useMemo(
    () =>
      formatAndHandleLocalizedContractErrorMessages({
        parentDictKey: stageDictKey,
        errorGroupDictKey: 'approve',
        dictionary,
        dictionaryGeneral,
        simulateError: approveSimulateError,
        writeError: approveWriteError,
        transactionError: approveTransactionError,
      }),
    [approveSimulateError, approveWriteError, approveTransactionError]
  );

  const addBLSErrorMessage = useMemo(
    () =>
      formatAndHandleLocalizedContractErrorMessages({
        parentDictKey: stageDictKey,
        errorGroupDictKey: 'arbitrum',
        dictionary,
        dictionaryGeneral,
        simulateError: addBLSSimulateError,
        writeError: addBLSWriteError,
        transactionError: addBLSTransactionError,
      }),
    [addBLSSimulateError, addBLSWriteError, addBLSTransactionError]
  );

  const allowanceReadStatus = useMemo(
    () => parseContractStatusToProgressStatus(readStatus),
    [readStatus]
  );

  const approveWriteStatus = useMemo(
    () => parseContractStatusToProgressStatus(approveWriteStatusRaw),
    [approveWriteStatusRaw]
  );

  const addBLSStatus = useMemo(
    () => parseContractStatusToProgressStatus(addBLSStatusRaw),
    [addBLSStatusRaw]
  );

  // NOTE: Automatically triggers the write stage once the approval has succeeded
  useEffect(() => {
    if (enabled && approveWriteStatusRaw === 'success') {
      addBLSPubKey();
    }
  }, [enabled, approveWriteStatusRaw]);

  return {
    registerAndStake,
    resetRegisterAndStake,
    allowanceReadStatus,
    approveWriteStatus,
    approveErrorMessage,
    addBLSErrorMessage,
    addBLSStatus,
    enabled,
  };
}
