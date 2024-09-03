'use client';

import { OpenNodeCard } from '@/components/OpenNodeCard';
import { URL } from '@/lib/constants';
import { externalLink } from '@/lib/locale-defaults';
import { ModuleGridInfoContent } from '@session/ui/components/ModuleGrid';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { generateOpenNodes } from '@session/sent-staking-js/test';
import { useStakingBackendSuspenseQuery } from '@/lib/sent-staking-backend-client';
import { getOpenNodes } from '@/lib/queries/getOpenNodes';
import { NodesListSkeleton } from '@/components/NodesListModule';
import { useFeatureFlag } from '@/lib/feature-flags-client';
import { FEATURE_FLAG } from '@/lib/feature-flags';

export default function OpenNodes() {
  const showMockNodes = useFeatureFlag(FEATURE_FLAG.MOCK_OPEN_NODES);
  const showNoNodes = useFeatureFlag(FEATURE_FLAG.MOCK_NO_OPEN_NODES);

  if (showMockNodes && showNoNodes) {
    console.error('Cannot show mock nodes and no nodes at the same time');
  }

  const { data, isLoading } = useStakingBackendSuspenseQuery(getOpenNodes);

  const nodes = useMemo(() => {
    if (showMockNodes) {
      return generateOpenNodes();
    } else if (showNoNodes) {
      return [];
    }
    return data?.nodes ?? [];
  }, [data?.nodes, showMockNodes, showNoNodes]);

  return isLoading ? (
    <NodesListSkeleton />
  ) : nodes.length ? (
    nodes.map((node) => <OpenNodeCard key={node.service_node_pubkey} node={node} />)
  ) : (
    <NoNodes />
  );
}

function NoNodes() {
  const dictionary = useTranslations('modules.openNodes');
  return (
    <ModuleGridInfoContent>
      <p>{dictionary('noNodesP1')}</p>
      <p>{dictionary.rich('noNodesP2', { link: externalLink(URL.SESSION_NODE_DOCS) })}</p>
    </ModuleGridInfoContent>
  );
}
