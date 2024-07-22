'use client';

import { useTranslations } from 'next-intl';
import { getOpenNodes } from '@/lib/queries/getOpenNodes';
import ActionModule from '@/app/stake/ActionModule';
import { useMemo } from 'react';
import { useStakingBackendSuspenseQuery } from '@/lib/sent-staking-backend-client';
import { NodeStakingForm } from '@/app/stake/[nodeId]/NodeStaking';
import { usePathname } from 'next/navigation';
import { type StakedNode, StakedNodeCard } from '@/components/StakedNodeCard';
import { getNode } from '@/lib/queries/getNode';
import { useQuery } from '@tanstack/react-query';
import { areHexesEqual } from '@session/util/string';

export default function NotFound() {
  const registerDictionary = useTranslations('actionModules.register');

  const pathname = usePathname();

  const nodeId = pathname.split('/').at(-2);

  const { data: openData } = useStakingBackendSuspenseQuery(getOpenNodes);
  const { data: runningNode } = useQuery({
    queryKey: ['getNode', nodeId],
    queryFn: () => getNode({ address: nodeId! }),
    enabled: Boolean(nodeId),
  });

  const openNode = useMemo(() => {
    return openData?.nodes?.find((node) => areHexesEqual(node.service_node_pubkey, nodeId));
  }, [openData, nodeId]);

  const nodeAlreadyRunning = runningNode && 'state' in runningNode && runningNode.state;

  return (
    <ActionModule background={1} title={registerDictionary('title')}>
      {registerDictionary('notFound.description')}
      <br />
      {nodeAlreadyRunning ? (
        <>
          <span className="mb-4 text-lg font-medium">
            {registerDictionary('notFound.foundRunningNode')}
          </span>
          <StakedNodeCard node={runningNode as StakedNode} />
          <br />
        </>
      ) : null}
      {openNode ? (
        <>
          <span className="mb-4 text-lg font-medium">
            {registerDictionary('notFound.foundOpenNode')}
          </span>
          <NodeStakingForm node={openNode} />
        </>
      ) : null}
    </ActionModule>
  );
}
