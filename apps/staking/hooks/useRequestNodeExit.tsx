import { useMemo } from 'react';
import { useInitiateRemoveBLSPublicKey } from '@session/contracts/hooks/ServiceNodeRewards';
import { useTranslations } from 'next-intl';
import {
  formatAndHandleLocalizedContractErrorMessages,
  parseContractStatusToProgressStatus,
} from '@/lib/contracts';

type UseRequestNodeExitParams = {
  contractId: number;
};

export default function useRequestNodeExit({ contractId }: UseRequestNodeExitParams) {
  const stageDictKey = 'nodeCard.staked.requestExit.dialog.stage' as const;
  const dictionary = useTranslations(stageDictKey);
  const dictionaryGeneral = useTranslations('general');

  const {
    initiateRemoveBLSPublicKey,
    fee,
    estimateContractWriteFee,
    contractCallStatus,
    simulateError,
    writeError,
    transactionError,
    simulateEnabled,
    resetContract,
  } = useInitiateRemoveBLSPublicKey({
    contractId,
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
    initiateRemoveBLSPublicKey,
    fee,
    estimateContractWriteFee,
    simulateEnabled,
    resetContract,
    errorMessage,
    status,
  };
}
