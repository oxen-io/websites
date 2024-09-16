'use client';

import {
  useClaimRewardsQuery,
  useUpdateRewardsBalanceQuery,
  type UseUpdateRewardsBalanceQueryParams,
} from '@session/contracts/hooks/ServiceNodeRewards';
import { useEffect, useMemo, useState } from 'react';
import { toast } from '@session/ui/lib/toast';
import { useTranslations } from 'next-intl';
import type {
  GenericContractStatus,
  WriteContractStatus,
} from '@session/contracts/hooks/useContractWriteQuery';

export enum CLAIM_REWARDS_STATE {
  SIMULATE_UPDATE_BALANCE,
  WRITE_UPDATE_BALANCE,
  TRANSACTION_UPDATE_BALANCE,
  SIMULATE_CLAIM,
  WRITE_CLAIM,
  TRANSACTION_CLAIM,
}

const useClaimRewardsStage = ({
  updateBalanceSimulateStatus,
  updateBalanceWriteStatus,
  updateBalanceTransactionStatus,
  claimSimulateStatus,
  claimWriteStatus,
  claimTransactionStatus,
  skipUpdateBalance,
}: {
  updateBalanceSimulateStatus: GenericContractStatus;
  updateBalanceWriteStatus: WriteContractStatus;
  updateBalanceTransactionStatus: GenericContractStatus;
  claimSimulateStatus: GenericContractStatus;
  claimWriteStatus: WriteContractStatus;
  claimTransactionStatus: GenericContractStatus;
  skipUpdateBalance: boolean;
}) => {
  const stage = useMemo(() => {
    if (
      (skipUpdateBalance ||
        (updateBalanceSimulateStatus === 'success' &&
          updateBalanceWriteStatus === 'success' &&
          updateBalanceTransactionStatus === 'success')) &&
      claimSimulateStatus === 'success' &&
      claimWriteStatus === 'success' &&
      claimTransactionStatus === 'success'
    ) {
      return CLAIM_REWARDS_STATE.TRANSACTION_CLAIM;
    }

    if (
      (skipUpdateBalance ||
        (updateBalanceSimulateStatus === 'success' &&
          updateBalanceWriteStatus === 'success' &&
          updateBalanceTransactionStatus === 'success')) &&
      claimSimulateStatus === 'success' &&
      claimWriteStatus === 'success' &&
      claimTransactionStatus !== 'success'
    ) {
      return CLAIM_REWARDS_STATE.SIMULATE_CLAIM;
    }

    if (
      (skipUpdateBalance ||
        (updateBalanceSimulateStatus === 'success' &&
          updateBalanceWriteStatus === 'success' &&
          updateBalanceTransactionStatus === 'success')) &&
      claimSimulateStatus === 'success' &&
      claimWriteStatus !== 'success' &&
      claimTransactionStatus !== 'success'
    ) {
      return CLAIM_REWARDS_STATE.WRITE_CLAIM;
    }

    if (
      (skipUpdateBalance ||
        (updateBalanceSimulateStatus === 'success' &&
          updateBalanceWriteStatus === 'success' &&
          updateBalanceTransactionStatus === 'success')) &&
      claimSimulateStatus !== 'success' &&
      claimWriteStatus !== 'success' &&
      claimTransactionStatus !== 'success'
    ) {
      return CLAIM_REWARDS_STATE.SIMULATE_CLAIM;
    }

    if (
      updateBalanceSimulateStatus === 'success' &&
      updateBalanceWriteStatus === 'success' &&
      updateBalanceTransactionStatus !== 'success' &&
      claimSimulateStatus !== 'success' &&
      claimWriteStatus !== 'success' &&
      claimTransactionStatus !== 'success'
    ) {
      return CLAIM_REWARDS_STATE.TRANSACTION_UPDATE_BALANCE;
    }

    if (
      updateBalanceSimulateStatus === 'success' &&
      updateBalanceWriteStatus !== 'success' &&
      updateBalanceTransactionStatus !== 'success' &&
      claimSimulateStatus !== 'success' &&
      claimWriteStatus !== 'success' &&
      claimTransactionStatus !== 'success'
    ) {
      return CLAIM_REWARDS_STATE.WRITE_UPDATE_BALANCE;
    }

    if (
      updateBalanceSimulateStatus !== 'success' &&
      updateBalanceWriteStatus !== 'success' &&
      updateBalanceTransactionStatus !== 'success' &&
      claimSimulateStatus !== 'success' &&
      claimWriteStatus !== 'success' &&
      claimTransactionStatus !== 'success'
    ) {
      return CLAIM_REWARDS_STATE.SIMULATE_UPDATE_BALANCE;
    }
    return CLAIM_REWARDS_STATE.SIMULATE_UPDATE_BALANCE;
  }, [
    updateBalanceSimulateStatus,
    updateBalanceWriteStatus,
    updateBalanceTransactionStatus,
    claimSimulateStatus,
    claimWriteStatus,
    claimTransactionStatus,
    skipUpdateBalance,
  ]);

  const subStage = useMemo(() => {
    switch (stage) {
      case CLAIM_REWARDS_STATE.SIMULATE_UPDATE_BALANCE:
        return updateBalanceSimulateStatus;
      case CLAIM_REWARDS_STATE.WRITE_UPDATE_BALANCE:
        return updateBalanceWriteStatus;
      case CLAIM_REWARDS_STATE.TRANSACTION_UPDATE_BALANCE:
        return updateBalanceTransactionStatus;
      case CLAIM_REWARDS_STATE.SIMULATE_CLAIM:
        return claimSimulateStatus;
      case CLAIM_REWARDS_STATE.WRITE_CLAIM:
        return claimWriteStatus;
      case CLAIM_REWARDS_STATE.TRANSACTION_CLAIM:
        return claimTransactionStatus;
      default:
        return 'pending';
    }
  }, [
    stage,
    updateBalanceSimulateStatus,
    updateBalanceWriteStatus,
    updateBalanceTransactionStatus,
    claimSimulateStatus,
    claimWriteStatus,
    claimTransactionStatus,
  ]);

  return { stage, subStage };
};

type UseClaimRewardsParams = UseUpdateRewardsBalanceQueryParams;

export default function useClaimRewards({
  address,
  rewards,
  blsSignature,
  excludedSigners,
}: UseClaimRewardsParams) {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [skipUpdateBalance, setSkipUpdateBalance] = useState<boolean>(false);

  const dictionary = useTranslations('modules.claim.stage');
  const dictionaryFee = useTranslations('modules.claim.dialog.alert');

  const {
    updateRewardsBalance,
    fee: updateBalanceFee,
    gasPrice: updateBalanceGasPrice,
    gasAmountEstimate: updateBalanceGasAmountEstimate,
    estimateContractWriteFee: updateBalanceEstimateContractWriteFee,
    refetchContractWriteFeeEstimate: updateBalanceRefetchContractWriteFeeEstimate,
    estimateFeeStatus: updateBalanceEstimateFeeStatus,
    simulateStatus: updateBalanceSimulateStatus,
    writeStatus: updateBalanceWriteStatus,
    transactionStatus: updateBalanceTransactionStatus,
    estimateFeeError: updateBalanceEstimateFeeError,
    simulateError: updateBalanceSimulateError,
    writeError: updateBalanceWriteError,
    transactionError: updateBalanceTransactionError,
  } = useUpdateRewardsBalanceQuery({ address, rewards, blsSignature, excludedSigners });

  const {
    claimRewards,
    fee: claimFee,
    gasPrice: claimGasPrice,
    gasAmountEstimate: claimGasAmountEstimate,
    estimateContractWriteFee: claimEstimateContractWriteFee,
    refetchContractWriteFeeEstimate: claimRefetchContractWriteFeeEstimate,
    estimateFeeStatus: claimEstimateFeeStatus,
    simulateStatus: claimSimulateStatus,
    writeStatus: claimWriteStatus,
    transactionStatus: claimTransactionStatus,
    estimateFeeError: claimEstimateFeeError,
    simulateError: claimSimulateError,
    writeError: claimWriteError,
    transactionError: claimTransactionError,
  } = useClaimRewardsQuery();

  const { stage, subStage } = useClaimRewardsStage({
    updateBalanceSimulateStatus,
    updateBalanceWriteStatus,
    updateBalanceTransactionStatus,
    claimSimulateStatus,
    claimWriteStatus,
    claimTransactionStatus,
    skipUpdateBalance,
  });

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

  useEffect(() => {
    if (enabled && (skipUpdateBalance || updateBalanceTransactionStatus === 'success')) {
      claimRewards();
    }
  }, [enabled, skipUpdateBalance, updateBalanceTransactionStatus]);

  /**
   * NOTE: All of these useEffects are required to inform the user of errors via the toaster
   */
  useEffect(() => {
    if (updateBalanceEstimateFeeError) {
      // If the gas estimation fails with the RecipientRewardsTooLow error, we can skip the update balance step
      // @ts-expect-error -- TODO: Properly type this error
      if (updateBalanceEstimateFeeError?.cause?.data?.abiItem?.name === 'RecipientRewardsTooLow') {
        setSkipUpdateBalance(true);
      } else {
        toast.handleError(updateBalanceEstimateFeeError);
        toast.error(dictionaryFee('gasFetchFailedUpdateBalance'));
      }
    }
  }, [updateBalanceEstimateFeeError]);

  useEffect(() => {
    if (updateBalanceSimulateError) {
      toast.handleError(updateBalanceSimulateError);
      toast.error(dictionary('updateBalance.simulate.errorTooltip'));
    }
  }, [updateBalanceSimulateError]);

  useEffect(() => {
    if (updateBalanceWriteError) {
      toast.handleError(updateBalanceWriteError);
      toast.error(dictionary('updateBalance.write.errorTooltip'));
    }
  }, [updateBalanceWriteError]);

  useEffect(() => {
    if (updateBalanceTransactionError) {
      toast.handleError(updateBalanceTransactionError);
      toast.error(dictionary('updateBalance.transaction.errorTooltip'));
    }
  }, [updateBalanceTransactionError]);

  useEffect(() => {
    if (claimEstimateFeeError) {
      toast.handleError(claimEstimateFeeError);
      toast.error(dictionaryFee('gasFetchFailedClaimRewards'));
    }
  }, [claimEstimateFeeError]);

  useEffect(() => {
    if (claimSimulateError) {
      toast.handleError(claimSimulateError);
      toast.error(dictionary('claimRewards.simulate.errorTooltip'));
    }
  }, [claimSimulateError]);

  useEffect(() => {
    if (claimWriteError) {
      toast.handleError(claimWriteError);
      toast.error(dictionary('claimRewards.write.errorTooltip'));
    }
  }, [claimWriteError]);

  useEffect(() => {
    if (claimTransactionError) {
      toast.handleError(claimTransactionError);
      toast.error(dictionary('claimRewards.transaction.errorTooltip'));
    }
  }, [claimTransactionError]);

  return {
    updateBalanceAndClaimRewards,
    estimateFee,
    refetchFeeEstimate,
    updateBalanceFee,
    updateBalanceGasPrice,
    updateBalanceGasAmountEstimate,
    claimFee,
    claimGasPrice,
    claimGasAmountEstimate,
    stage,
    subStage,
    enabled,
    updateBalanceEstimateFeeStatus,
    claimEstimateFeeStatus,
    skipUpdateBalance,
  };
}
