'use client';

import { useRewardRateQuery } from '@session/contracts/hooks/RewardRatePool';
import { useTotalNodesQuery } from '@session/contracts/hooks/ServiceNodeRewards';
import {
  CONTRACT_READ_STATUS,
  mergeContractReadStatuses,
} from '@session/contracts/hooks/contract-hooks';
import { getUnixTimestamp } from '@session/util/date';
import { useMemo } from 'react';

function calculateDailyNodeReward(totalNodes: bigint, rewardRate: bigint) {
  console.log('totalNodes', totalNodes);
  console.log('rewardRate', rewardRate);
  return (Number(rewardRate) / Number(totalNodes)) * 720;
}

export default function useDailyNodeReward() {
  const {
    totalNodes,
    status: totalNodesStatus,
    error: errorNodesQuery,
    refetch: refetchTotalNodes,
  } = useTotalNodesQuery({ startEnabled: true, args: [] });
  const {
    rewardRate,
    status: rewardRateStatus,
    error: errorRewardRateQuery,
    refetch: refetchRewardRate,
  } = useRewardRateQuery({ startEnabled: true, args: [BigInt(getUnixTimestamp())] });

  const dailyNodeReward = useMemo(() => {
    if (
      totalNodesStatus === CONTRACT_READ_STATUS.SUCCESS &&
      rewardRateStatus === CONTRACT_READ_STATUS.SUCCESS &&
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
    () => mergeContractReadStatuses([totalNodesStatus, rewardRateStatus]),
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
