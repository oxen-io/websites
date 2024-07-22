'use client';

import { OpenNodeCard } from '@/components/OpenNodeCard';
import { URL } from '@/lib/constants';
import { externalLink } from '@/lib/locale-defaults';
import { ModuleGridContent, ModuleGridInfoContent } from '@session/ui/components/ModuleGrid';
import { Loading } from '@session/ui/components/loading';
import { useTranslations } from 'next-intl';
import { FEATURE_FLAG, useFeatureFlag } from '@/providers/feature-flag-provider';
import { useMemo } from 'react';
import { generateOpenNodes } from '@session/sent-staking-js/test';
import { useStakingBackendSuspenseQuery } from '@/lib/sent-staking-backend-client';
import { getOpenNodes } from '@/lib/queries/getOpenNodes';
import { InfoNodeCardSkeleton } from '@/components/InfoNodeCard';

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

  return (
    <ModuleGridContent className="h-full md:overflow-y-auto">
      {isLoading ? (
        <Loading />
      ) : nodes.length ? (
        nodes.map((node) => <OpenNodeCard key={node.service_node_pubkey} node={node} />)
      ) : (
        <NoNodes />
      )}
    </ModuleGridContent>
  );
}

export function OpenNodesSkeleton() {
  return (
    <ModuleGridContent className="h-full md:overflow-y-auto">
      <InfoNodeCardSkeleton />
      <InfoNodeCardSkeleton />
      <InfoNodeCardSkeleton />
    </ModuleGridContent>
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
