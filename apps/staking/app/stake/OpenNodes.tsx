'use client';

import { OpenNodeCard } from '@/components/OpenNodeCard';
import { URL } from '@/lib/constants';
import { externalLink } from '@/lib/locale-defaults';
import { FEATURE_FLAG, useFeatureFlag } from '@/providers/feature-flag-provider';
import { useSessionStakingQuery } from '@/providers/sent-staking-provider';
import { OpenNode } from '@session/sent-staking-js/client';
import { generateOpenNodes } from '@session/sent-staking-js/test';
import {
  ModuleGridContent,
  ModuleGridHeader,
  ModuleGridInfoContent,
  ModuleGridTitle,
} from '@session/ui/components/ModuleGrid';
import { Loading } from '@session/ui/components/loading';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export default function OpenNodesModule() {
  const dictionary = useTranslations('modules.openNodes');
  return (
    <>
      <ModuleGridHeader>
        <ModuleGridTitle>{dictionary('title')}</ModuleGridTitle>
      </ModuleGridHeader>
      <OpenNodes />
    </>
  );
}

function OpenNodes() {
  const showMockNodes = useFeatureFlag(FEATURE_FLAG.MOCK_OPEN_NODES);
  const showNoNodes = useFeatureFlag(FEATURE_FLAG.MOCK_NO_OPEN_NODES);

  if (showMockNodes && showNoNodes) {
    console.error('Cannot show mock nodes and no nodes at the same time');
  }

  const { address } = useWallet();
  const { data, isLoading } = useSessionStakingQuery({
    query: 'getOpenNodes',
    args: undefined,
  });

  const nodes = useMemo(() => {
    if (showMockNodes) {
      return generateOpenNodes({ userAddress: address });
    } else if (showNoNodes) {
      return [] as Array<OpenNode>;
    }
    return data?.nodes as Array<OpenNode>;
  }, [data, showMockNodes, showNoNodes]);

  return (
    <ModuleGridContent className="h-full md:overflow-y-auto">
      {isLoading ? (
        <Loading />
      ) : nodes && nodes.length > 0 ? (
        nodes.map((node) => <OpenNodeCard key={node.pubKey} node={node} />)
      ) : (
        <NoNodes />
      )}
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
