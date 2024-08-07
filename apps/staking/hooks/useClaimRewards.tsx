'use client';

import { TOAST } from '@/lib/constants';
import {
  useClaimRewardsQuery,
  useUpdateRewardsBalanceQuery,
  type UseUpdateRewardsBalanceQueryParams,
} from '@session/contracts/hooks/ServiceNodeRewards';
import { useEffect, useMemo, useState } from 'react';
import { toast } from '@session/ui/lib/sonner';
import { collapseString } from '@session/util/string';
import type { SimulateContractErrorType, WriteContractErrorType } from 'viem';
import { isProduction } from '@/lib/env';
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
}: {
  updateBalanceSimulateStatus: GenericContractStatus;
  updateBalanceWriteStatus: WriteContractStatus;
  updateBalanceTransactionStatus: GenericContractStatus;
  claimSimulateStatus: GenericContractStatus;
  claimWriteStatus: WriteContractStatus;
  claimTransactionStatus: GenericContractStatus;
}) => {
  const stage = useMemo(() => {
    if (
      updateBalanceSimulateStatus === 'success' &&
      updateBalanceWriteStatus === 'success' &&
      updateBalanceTransactionStatus === 'success' &&
      claimSimulateStatus === 'success' &&
      claimWriteStatus === 'success' &&
      claimTransactionStatus === 'success'
    ) {
      return CLAIM_REWARDS_STATE.TRANSACTION_CLAIM;
    }

    if (
      updateBalanceSimulateStatus === 'success' &&
      updateBalanceWriteStatus === 'success' &&
      updateBalanceTransactionStatus === 'success' &&
      claimSimulateStatus === 'success' &&
      claimWriteStatus === 'success' &&
      claimTransactionStatus !== 'success'
    ) {
      return CLAIM_REWARDS_STATE.SIMULATE_CLAIM;
    }

    if (
      updateBalanceSimulateStatus === 'success' &&
      updateBalanceWriteStatus === 'success' &&
      updateBalanceTransactionStatus === 'success' &&
      claimSimulateStatus === 'success' &&
      claimWriteStatus !== 'success' &&
      claimTransactionStatus !== 'success'
    ) {
      return CLAIM_REWARDS_STATE.WRITE_CLAIM;
    }

    if (
      updateBalanceSimulateStatus === 'success' &&
      updateBalanceWriteStatus === 'success' &&
      updateBalanceTransactionStatus === 'success' &&
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

  console.log(updateBalanceEstimateFeeError);

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

  console.log(claimEstimateFeeError);

  const { stage, subStage } = useClaimRewardsStage({
    updateBalanceSimulateStatus,
    updateBalanceWriteStatus,
    updateBalanceTransactionStatus,
    claimSimulateStatus,
    claimWriteStatus,
    claimTransactionStatus,
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
    updateRewardsBalance();
  };

  useEffect(() => {
    if (enabled && updateBalanceTransactionStatus === 'success') {
      claimRewards();
    }
  }, [enabled, updateBalanceTransactionStatus]);

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
    if (updateBalanceEstimateFeeError) {
      handleError(updateBalanceEstimateFeeError);
      toast.error(dictionaryFee('gasFetchFailedUpdateBalance'));
    }
  }, [updateBalanceEstimateFeeError]);

  useEffect(() => {
    if (updateBalanceSimulateError) {
      handleError(updateBalanceSimulateError);
      toast.error(dictionary('updateBalance.simulate.errorTooltip'));
    }
  }, [updateBalanceSimulateError]);

  useEffect(() => {
    if (updateBalanceWriteError) {
      handleError(updateBalanceWriteError);
      toast.error(dictionary('updateBalance.write.errorTooltip'));
    }
  }, [updateBalanceWriteError]);

  useEffect(() => {
    if (updateBalanceTransactionError) {
      handleError(updateBalanceTransactionError);
      toast.error(dictionary('updateBalance.transaction.errorTooltip'));
    }
  }, [updateBalanceTransactionError]);

  useEffect(() => {
    if (claimEstimateFeeError) {
      handleError(claimEstimateFeeError);
      toast.error(dictionaryFee('gasFetchFailedClaimRewards'));
    }
  }, [claimEstimateFeeError]);

  useEffect(() => {
    if (claimSimulateError) {
      handleError(claimSimulateError);
      toast.error(dictionary('claimRewards.simulate.errorTooltip'));
    }
  }, [claimSimulateError]);

  useEffect(() => {
    if (claimWriteError) {
      handleError(claimWriteError);
      toast.error(dictionary('claimRewards.write.errorTooltip'));
    }
  }, [claimWriteError]);

  useEffect(() => {
    if (claimTransactionError) {
      handleError(claimTransactionError);
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
  };
}
