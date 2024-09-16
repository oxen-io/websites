'use client';

import {
  getVariableFontSizeForLargeModule,
  ModuleDynamicQueryText,
} from '@/components/ModuleDynamic';
import { getTotalStakedAmountForAddressBigInt } from '@/components/NodeCard';
import type { ServiceNode } from '@session/sent-staking-js/client';
import { Module, ModuleTitle } from '@session/ui/components/Module';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import type { Address } from 'viem';
import { useStakingBackendQueryWithParams } from '@/lib/sent-staking-backend-client';
import { getStakedNodes } from '@/lib/queries/getStakedNodes';
import { generateMockNodeData } from '@session/sent-staking-js/test';
import type { QUERY_STATUS } from '@/lib/query';
import { formatSENTBigInt } from '@session/contracts/hooks/SENT';
import { FEATURE_FLAG } from '@/lib/feature-flags';
import { useFeatureFlag } from '@/lib/feature-flags-client';

const getTotalStakedAmount = ({
  nodes,
  address,
}: {
  nodes: Array<ServiceNode>;
  address: Address;
}) => {
  return formatSENTBigInt(
    nodes.reduce(
      (acc, node) => acc + getTotalStakedAmountForAddressBigInt(node.contributors, address),
      BigInt(0)
    )
  );
};

function useTotalStakedAmount() {
  const showMockNodes = useFeatureFlag(FEATURE_FLAG.MOCK_STAKED_NODES);
  const showNoNodes = useFeatureFlag(FEATURE_FLAG.MOCK_NO_STAKED_NODES);

  if (showMockNodes && showNoNodes) {
    console.error('Cannot show mock nodes and no nodes at the same time');
  }

  const { address } = useWallet();

  const { data, refetch, status } = useStakingBackendQueryWithParams(
    getStakedNodes,
    {
      address: address!,
    },
    { enabled: !!address }
  );

  const nodes = useMemo(() => {
    if (!address || showNoNodes) {
      return [];
    } else if (showMockNodes) {
      return generateMockNodeData({ userAddress: address }).nodes;
    }
    return data?.nodes ?? [];
  }, [data, showMockNodes, showNoNodes]);

  const totalStakedAmount = useMemo(() => {
    if (!address || !nodes.length) return null;
    return getTotalStakedAmount({ nodes, address });
  }, [nodes.length, address]);

  return { totalStakedAmount, status, refetch };
}

export default function BalanceModule() {
  const { totalStakedAmount, status, refetch } = useTotalStakedAmount();
  const dictionary = useTranslations('modules.balance');
  const toastDictionary = useTranslations('modules.toast');
  const titleFormat = useTranslations('modules.title');
  const title = dictionary('title');

  return (
    <Module size="lg" variant="hero">
      <ModuleTitle>{titleFormat('format', { title })}</ModuleTitle>
      <ModuleDynamicQueryText
        status={status as QUERY_STATUS}
        fallback={0}
        errorToast={{
          messages: {
            error: toastDictionary('error', { module: title }),
            refetching: toastDictionary('refetching'),
            success: toastDictionary('refetchSuccess', { module: title }),
          },
          refetch,
        }}
        style={{
          fontSize: getVariableFontSizeForLargeModule(totalStakedAmount?.length ?? 5),
        }}
      >
        {totalStakedAmount}
      </ModuleDynamicQueryText>
    </Module>
  );
}
