'use client';

import {
  useClaimRewardsQuery,
  useUpdateRewardsBalanceQuery,
  type UseUpdateRewardsBalanceQueryParams,
} from '@session/contracts/hooks/ServiceNodeRewards';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { getContractErrorName } from '@session/contracts';

import {
  formatAndHandleLocalizedContractErrorMessages,
  parseContractStatusToProgressStatus,
} from '@/lib/contracts';

type UseClaimRewardsParams = UseUpdateRewardsBalanceQueryParams;

export default function useClaimRewards({
  address,
  rewards,
  blsSignature,
  excludedSigners,
}: UseClaimRewardsParams) {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [skipUpdateBalance, setSkipUpdateBalance] = useState<boolean>(false);

  const stageDictKey = 'modules.claim.stage' as const;
  const dictionary = useTranslations(stageDictKey);
  const dictionaryGeneral = useTranslations('general');

  const {
    updateRewardsBalance,
    fee: updateBalanceFee,
    estimateContractWriteFee: updateBalanceEstimateContractWriteFee,
    refetchContractWriteFeeEstimate: updateBalanceRefetchContractWriteFeeEstimate,
    contractCallStatus: updateBalanceContractCallStatus,
    transactionStatus: updateBalanceTransactionStatus,
    estimateFeeError: updateBalanceEstimateFeeError,
    simulateError: updateBalanceSimulateError,
    writeError: updateBalanceWriteError,
    transactionError: updateBalanceTransactionError,
  } = useUpdateRewardsBalanceQuery({ address, rewards, blsSignature, excludedSigners });

  const {
    claimRewards,
    fee: claimFee,
    estimateContractWriteFee: claimEstimateContractWriteFee,
    refetchContractWriteFeeEstimate: claimRefetchContractWriteFeeEstimate,
    contractCallStatus: claimContractCallStatus,
    simulateError: claimSimulateError,
    writeError: claimWriteError,
    transactionError: claimTransactionError,
  } = useClaimRewardsQuery();

  const updateRewardsBalanceStatus = useMemo(
    () => parseContractStatusToProgressStatus(updateBalanceContractCallStatus),
    [updateBalanceContractCallStatus]
  );

  const claimRewardsStatus = useMemo(
    () => parseContractStatusToProgressStatus(claimContractCallStatus),
    [claimContractCallStatus]
  );

  const estimateFee = () => {
    updateBalanceEstimateContractWriteFee();
    claimEstimateContractWriteFee();
  };

  const refetchFeeEstimate = () => {
    claimRefetchContractWriteFeeEstimate();
    updateBalanceRefetchContractWriteFeeEstimate();
  };

  const updateBalanceAndClaimRewards = () => {
    setEnabled(true);
    if (!skipUpdateBalance) {
      updateRewardsBalance();
    }
  };

  const updateRewardsBalanceErrorMessage = useMemo(
    () =>
      formatAndHandleLocalizedContractErrorMessages({
        parentDictKey: stageDictKey,
        errorGroupDictKey: 'balance',
        dictionary,
        dictionaryGeneral,
        simulateError: updateBalanceSimulateError,
        writeError: updateBalanceWriteError,
        transactionError: updateBalanceTransactionError,
      }),
    [updateBalanceSimulateError, updateBalanceWriteError, updateBalanceTransactionError]
  );

  const claimRewardsErrorMessage = useMemo(
    () =>
      formatAndHandleLocalizedContractErrorMessages({
        parentDictKey: stageDictKey,
        errorGroupDictKey: 'claim',
        dictionary,
        dictionaryGeneral,
        simulateError: claimSimulateError,
        writeError: claimWriteError,
        transactionError: claimTransactionError,
      }),
    [claimSimulateError, claimWriteError, claimTransactionError]
  );

  useEffect(() => {
    if (enabled && (skipUpdateBalance || updateBalanceTransactionStatus === 'success')) {
      claimRewards();
    }
  }, [enabled, skipUpdateBalance, updateBalanceTransactionStatus]);

  useEffect(() => {
    // If the gas estimation fails with the RecipientRewardsTooLow error, we can skip the update balance step
    if (
      updateBalanceEstimateFeeError &&
      getContractErrorName(updateBalanceEstimateFeeError) === 'RecipientRewardsTooLow'
    ) {
      setSkipUpdateBalance(true);
    }
  }, [updateBalanceEstimateFeeError]);

  return {
    updateBalanceAndClaimRewards,
    refetchFeeEstimate,
    claimFee,
    updateBalanceFee,
    estimateFee,
    updateRewardsBalanceStatus,
    claimRewardsStatus,
    enabled,
    skipUpdateBalance,
    updateRewardsBalanceErrorMessage,
    claimRewardsErrorMessage,
  };
}
