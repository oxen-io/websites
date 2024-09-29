'use client';

import { useMemo } from 'react';
import { useStakingBackendQueryWithParams } from '@/lib/sent-staking-backend-client';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { getNodeRegistrations } from '@/lib/queries/getNodeRegistrations';
import { NodeRegistrationCard } from '@/components/NodeRegistrationCard';
import { useTranslations } from 'next-intl';
import { generateMockRegistrations } from '@session/sent-staking-js/test';
import { QUERY, URL } from '@/lib/constants';
import { isProduction } from '@/lib/env';
import { NodesListSkeleton } from '@/components/NodesListModule';
import { ModuleGridInfoContent } from '@session/ui/components/ModuleGrid';
import { externalLink } from '@/lib/locale-defaults';
import { WalletModalButtonWithLocales } from '@/components/WalletModalButtonWithLocales';
import { useFeatureFlag } from '@/lib/feature-flags-client';
import { FEATURE_FLAG } from '@/lib/feature-flags';
import { getStakedNodes } from '@/lib/queries/getStakedNodes';

export default function NodeRegistrations() {
  const showOneMockNode = useFeatureFlag(FEATURE_FLAG.MOCK_PENDING_NODES_ONE);
  const showTwoMockNodes = useFeatureFlag(FEATURE_FLAG.MOCK_PENDING_NODES_TWO);
  const showThreeMockNodes = useFeatureFlag(FEATURE_FLAG.MOCK_PENDING_NODES_THREE);
  const showManyMockNodes = useFeatureFlag(FEATURE_FLAG.MOCK_PENDING_NODES_MANY);
  const showNoNodes = useFeatureFlag(FEATURE_FLAG.MOCK_NO_PENDING_NODES);

  // TODO: use once we have user preferences
  /* const hideRegistrationsEnabled = useExperimentalFeatureFlag(
     EXPERIMENTAL_FEATURE_FLAG.HIDE_REGISTRATIONS
   );
   const hiddenPreparedRegistrations = useUserPreference('hiddenPreparedRegistrations');
   const forceShowPendingNodesModule = useUserPreference('forceShowPendingNodesModule');

   const [showHidden, setShowHidden] = useState<boolean>(false); */

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

  const { data: registrationsData, isLoading: isLoadingRegistrations } =
    useStakingBackendQueryWithParams(
      getNodeRegistrations,
      { address: address! },
      {
        enabled: isConnected,
        staleTime: isProduction
          ? QUERY.STALE_TIME_REGISTRATIONS_LIST
          : QUERY.STALE_TIME_REGISTRATIONS_LIST_DEV,
      }
    );

  const { data: stakesData, isLoading: isLoadingStakes } = useStakingBackendQueryWithParams(
    getStakedNodes,
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

    if (isLoadingRegistrations || isLoadingStakes) {
      return [];
    }

    if (!stakesData || stakesData.stakes.length === 0) {
      return registrationsData?.registrations ?? [];
    }

    const stakedNodeEd25519Pubkeys = stakesData.stakes.map(
      ({ service_node_pubkey }) => service_node_pubkey
    );

    return registrationsData?.registrations.filter(
      ({ pubkey_ed25519 }) => !stakedNodeEd25519Pubkeys.includes(pubkey_ed25519)
    );
  }, [
    isLoadingRegistrations,
    isLoadingStakes,
    registrationsData?.registrations,
    stakesData?.stakes,
    address,
    showNoNodes,
    showOneMockNode,
    showTwoMockNodes,
    showThreeMockNodes,
    showManyMockNodes,
  ]);

  return address ? (
    isLoadingStakes || isLoadingRegistrations ? (
      <NodesListSkeleton />
    ) : nodes?.length ? (
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
