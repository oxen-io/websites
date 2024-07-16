'use client';

import {
  ModuleGrid,
  ModuleGridContent,
  ModuleGridHeader,
  ModuleGridTitle,
} from '@session/ui/components/ModuleGrid';
import { FEATURE_FLAG, useFeatureFlag } from '@/providers/feature-flag-provider';
import { useMemo } from 'react';
import { useStakingBackendQueryWithParams } from '@/lib/sent-staking-backend-client';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { getPendingNodes } from '@/lib/queries/getPendingNodes';
import { PendingNodeCard } from '@/components/PendingNodeCard';
import { useTranslations } from 'next-intl';
import { cn } from '@session/ui/lib/utils';
import { generatePendingNodes } from '@session/sent-staking-js/test';

export default function PendingNodesModule() {
  const showOneMockNode = useFeatureFlag(FEATURE_FLAG.MOCK_PENDING_NODES_ONE);
  const showTwoMockNodes = useFeatureFlag(FEATURE_FLAG.MOCK_PENDING_NODES_TWO);
  const showThreeMockNodes = useFeatureFlag(FEATURE_FLAG.MOCK_PENDING_NODES_THREE);
  const showManyMockNodes = useFeatureFlag(FEATURE_FLAG.MOCK_PENDING_NODES_MANY);
  const showNoNodes = useFeatureFlag(FEATURE_FLAG.MOCK_NO_PENDING_NODES);

  if (
    (showOneMockNode || showTwoMockNodes || showThreeMockNodes || showManyMockNodes) &&
    showNoNodes
  ) {
    console.error('Cannot show mock nodes and no nodes at the same time');
  }

  if (
    [showOneMockNode, showTwoMockNodes, showThreeMockNodes, showManyMockNodes].filter(Boolean)
      .length > 1
  ) {
    console.error(
      'You cant have multiple showMockNode flags enabled at once, ignoring all by the largest number'
    );
  }

  const dictionary = useTranslations('modules.pendingNodes');
  const { address, isConnected } = useWallet();

  const { data, isLoading } = useStakingBackendQueryWithParams(
    getPendingNodes,
    { address: address! },
    isConnected
  );

  const nodes = useMemo(() => {
    if (showNoNodes) {
      return [];
    }
    if (address) {
      if (showManyMockNodes) {
        return generatePendingNodes({ userAddress: address, numberOfNodes: 12 });
      } else if (showThreeMockNodes) {
        return generatePendingNodes({ userAddress: address, numberOfNodes: 3 });
      } else if (showTwoMockNodes) {
        return generatePendingNodes({ userAddress: address, numberOfNodes: 2 });
      } else if (showOneMockNode) {
        return generatePendingNodes({ userAddress: address, numberOfNodes: 1 });
      }
    }
    return data?.registrations ?? [];
  }, [
    data?.registrations,
    address,
    showNoNodes,
    showOneMockNode,
    showTwoMockNodes,
    showThreeMockNodes,
    showManyMockNodes,
  ]);

  return isLoading || nodes.length ? (
    <div
      className={cn(
        'col-span-2 grid h-min w-full transition-all duration-500 ease-in-out motion-reduce:transition-none',
        nodes.length ? 'max-h-96' : '-mb-6 max-h-0'
      )}
    >
      {nodes.length ? (
        <ModuleGrid variant="section" colSpan={2} className="max-h-96">
          <ModuleGridHeader>
            <ModuleGridTitle>{dictionary('title')}</ModuleGridTitle>
          </ModuleGridHeader>
          <ModuleGridContent className="h-full md:overflow-y-auto">
            {nodes.map((node) => (
              <PendingNodeCard key={node.pubkey_ed25519} node={node} />
            ))}
          </ModuleGridContent>
        </ModuleGrid>
      ) : null}
    </div>
  ) : null;
}
