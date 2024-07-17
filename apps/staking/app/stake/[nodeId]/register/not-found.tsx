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

export default function NotFound() {
  const registerDictionary = useTranslations('actionModules.register');

  const pathname = usePathname();

  const nodeId = pathname.split('/').at(-2);

  const { data: openData } = useStakingBackendSuspenseQuery(getOpenNodes);
  const { data: runningData } = useQuery({
    queryKey: ['getNode', nodeId],
    queryFn: async () => {
      const res = await getNode({ address: nodeId! });
      console.log(res);
      return res;
    },
    enabled: Boolean(nodeId),
  });

  const openNode = useMemo(() => {
    return openData?.nodes?.find((node) => node.service_node_pubkey === nodeId);
  }, [openData]);

  return (
    <ActionModule background={1} title={registerDictionary('title')}>
      {registerDictionary('notFound.description')}
      <br />
      {runningData ? (
        <>
          <span className="mb-4 text-lg font-medium">
            {registerDictionary('notFound.foundRunningNode')}
          </span>
          <StakedNodeCard node={runningData as StakedNode} />
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
