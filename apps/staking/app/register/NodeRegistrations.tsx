'use client';

import { FEATURE_FLAG, useFeatureFlag } from '@/providers/feature-flag-provider';
import { useMemo } from 'react';
import { useStakingBackendQueryWithParams } from '@/lib/sent-staking-backend-client';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { getPendingNodes } from '@/lib/queries/getPendingNodes';
import { NodeRegistrationCard } from '@/components/NodeRegistrationCard';
import { useTranslations } from 'next-intl';
import { generateMockRegistrations } from '@session/sent-staking-js/test';
import { QUERY, URL } from '@/lib/constants';
import { isProduction } from '@/lib/env';
import { NodesListSkeleton } from '@/components/NodesListModule';
import { ModuleGridInfoContent } from '@session/ui/components/ModuleGrid';
import { externalLink } from '@/lib/locale-defaults';
import { WalletModalButtonWithLocales } from '@/components/WalletModalButtonWithLocales';

export default function NodeRegistrations() {
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

  const { address, isConnected } = useWallet();

  const { data, isLoading } = useStakingBackendQueryWithParams(
    getPendingNodes,
    { address: address! },
    {
      enabled: isConnected,
      staleTime: isProduction
        ? QUERY.STALE_TIME_REGISTRATIONS_LIST
        : QUERY.STALE_TIME_REGISTRATIONS_LIST_DEV,
    }
  );

  const nodes = useMemo(() => {
    if (showNoNodes) {
      return [];
    }
    if (address) {
      if (showManyMockNodes) {
        return generateMockRegistrations({ userAddress: address, numberOfNodes: 12 });
      } else if (showThreeMockNodes) {
        return generateMockRegistrations({ userAddress: address, numberOfNodes: 3 });
      } else if (showTwoMockNodes) {
        return generateMockRegistrations({ userAddress: address, numberOfNodes: 2 });
      } else if (showOneMockNode) {
        return generateMockRegistrations({ userAddress: address, numberOfNodes: 1 });
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

  return address ? (
    isLoading ? (
      <NodesListSkeleton />
    ) : nodes.length ? (
      nodes.map((node) => <NodeRegistrationCard key={node.pubkey_ed25519} node={node} />)
    ) : (
      <NoNodes />
    )
  ) : (
    <NoWallet />
  );
}

function NoWallet() {
  const dictionary = useTranslations('modules.nodeRegistrations');
  return (
    <ModuleGridInfoContent>
      <p>{dictionary('noWalletP1')}</p>
      <p>
        {dictionary.rich('noNodesP2', { link: externalLink(URL.SESSION_NODE_SOLO_SETUP_DOCS) })}
      </p>
      <WalletModalButtonWithLocales rounded="md" size="lg" />
    </ModuleGridInfoContent>
  );
}

function NoNodes() {
  const dictionary = useTranslations('modules.nodeRegistrations');
  return (
    <ModuleGridInfoContent>
      <p>{dictionary('noNodesP1')}</p>
      <p>
        {dictionary.rich('noNodesP2', { link: externalLink(URL.SESSION_NODE_SOLO_SETUP_DOCS) })}
      </p>
    </ModuleGridInfoContent>
  );
}
