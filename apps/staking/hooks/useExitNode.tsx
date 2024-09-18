import { useMemo } from 'react';
import { useRemoveBLSPublicKeyWithSignature } from '@session/contracts/hooks/ServiceNodeRewards';
import { useTranslations } from 'next-intl';
import {
  formatAndHandleLocalizedContractErrorMessages,
  parseContractStatusToProgressStatus,
} from '@/lib/contracts';

type UseExitNodeParams = {
  blsPubKey: string;
  timestamp: number;
  blsSignature: string;
  excludedSigners?: Array<bigint>;
};

export default function useExitNode({
  blsPubKey,
  timestamp,
  blsSignature,
  excludedSigners,
}: UseExitNodeParams) {
  const stageDictKey = 'nodeCard.staked.requestExit.dialog.stage' as const;
  const dictionary = useTranslations(stageDictKey);
  const dictionaryGeneral = useTranslations('general');

  const {
    removeBLSPublicKeyWithSignature,
    fee,
    estimateContractWriteFee,
    contractCallStatus,
    simulateError,
    writeError,
    transactionError,
    simulateEnabled,
    resetContract,
  } = useRemoveBLSPublicKeyWithSignature({
    blsPubKey,
    timestamp,
    blsSignature,
    excludedSigners,
  });

  const errorMessage = useMemo(
    () =>
      formatAndHandleLocalizedContractErrorMessages({
        parentDictKey: stageDictKey,
        errorGroupDictKey: 'arbitrum',
        dictionary,
        dictionaryGeneral,
        simulateError,
        writeError,
        transactionError,
      }),
    [simulateError, writeError, transactionError]
  );

  const status = useMemo(
    () => parseContractStatusToProgressStatus(contractCallStatus),
    [contractCallStatus]
  );

  return {
    removeBLSPublicKeyWithSignature,
    fee,
    estimateContractWriteFee,
    simulateEnabled,
    resetContract,
    errorMessage,
    status,
  };
}
