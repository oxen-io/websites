'use client';

import { OpenNodeCard } from '@/components/OpenNodeCard';
import { URL } from '@/lib/constants';
import { externalLink } from '@/lib/locale-defaults';
import { ModuleGridInfoContent } from '@session/ui/components/ModuleGrid';
import { useTranslations } from 'next-intl';
import { useStakingBackendSuspenseQuery } from '@/lib/sent-staking-backend-client';
import { getOpenNodes } from '@/lib/queries/getOpenNodes';
import { NodesListSkeleton } from '@/components/NodesListModule';

export default function OpenNodes() {
  const { data, isLoading } = useStakingBackendSuspenseQuery(getOpenNodes);

  return isLoading ? (
    <NodesListSkeleton />
  ) : data?.nodes.length ? (
    data.nodes.map((node) => <OpenNodeCard key={node.service_node_pubkey} node={node} />)
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
