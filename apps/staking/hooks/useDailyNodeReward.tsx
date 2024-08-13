'use client';

import { useRewardRateQuery } from '@session/contracts/hooks/RewardRatePool';
import { useTotalNodesQuery } from '@session/contracts/hooks/ServiceNodeRewards';
import { mergeContractReadStatuses } from '@session/contracts/hooks/useContractReadQuery';
import { useMemo } from 'react';
import { formatBigIntTokenValue } from '@session/util/maths';
import { SENT_DECIMALS } from '@session/contracts';

/**
 * Calculate the daily node reward of a node on the network based on the total number of nodes and the last block reward rate.
 *
 * The daily node reward is calculated as follows:
 *
 * dailyNodeReward = (rewardRate / totalNodes) * 720
 *
 * Where:
 * - rewardRate is the last block reward rate.
 * - totalNodes is the total number of nodes on the network.
 * - 720 is the average number of blocks in a day.
 *
 * TODO - Update the calculation to use a better estimate of the number of blocks in a day.
 *
 * @param totalNodes The total number of nodes on the network.
 * @param rewardRate The last block reward rate.
 * @returns The daily node reward.
 */
function calculateDailyNodeReward(totalNodes: bigint, rewardRate: bigint) {
  return (Number(formatBigIntTokenValue(rewardRate, SENT_DECIMALS)) / Number(totalNodes)) * 720;
}

export default function useDailyNodeReward() {
  const {
    totalNodes,
    status: totalNodesStatus,
    error: errorNodesQuery,
    refetch: refetchTotalNodes,
  } = useTotalNodesQuery();
  const {
    rewardRate,
    status: rewardRateStatus,
    error: errorRewardRateQuery,
    refetch: refetchRewardRate,
  } = useRewardRateQuery();

  const dailyNodeReward = useMemo(() => {
    if (
      totalNodesStatus === 'success' &&
      rewardRateStatus === 'success' &&
      totalNodes &&
      rewardRate
    ) {
      return calculateDailyNodeReward(totalNodes, rewardRate);
    }
    return null;
  }, [totalNodesStatus, rewardRateStatus, totalNodes, rewardRate]);

  if (errorNodesQuery) {
    console.error('Error fetching total nodes', errorNodesQuery);
  }
  if (errorRewardRateQuery) {
    console.error('Error fetching reward rate', errorRewardRateQuery);
  }

  const status = useMemo(
    () => mergeContractReadStatuses(totalNodesStatus, rewardRateStatus),
    [totalNodesStatus, rewardRateStatus]
  );

  const refetch = async () => {
    return await Promise.all([refetchTotalNodes(), refetchRewardRate()]);
  };

  return {
    dailyNodeReward,
    status,
    refetch,
  };
}
