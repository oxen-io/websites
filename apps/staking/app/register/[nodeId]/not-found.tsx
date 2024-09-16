'use client';

import { useTranslations } from 'next-intl';
import { getOpenNodes } from '@/lib/queries/getOpenNodes';
import ActionModule from '@/components/ActionModule';
import { useMemo } from 'react';
import {
  useStakingBackendQueryWithParams,
  useStakingBackendSuspenseQuery,
} from '@/lib/sent-staking-backend-client';
import { NodeStakingForm } from '@/app/stake/[nodeId]/NodeStaking';
import { usePathname } from 'next/navigation';
import { StakedNode, StakedNodeCard } from '@/components/StakedNodeCard';
import { areHexesEqual } from '@session/util/string';
import { getStakedNodes } from '@/lib/queries/getStakedNodes';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { parseSessionNodeData } from '@/app/mystakes/modules/StakedNodesModule';
import { useQuery } from '@tanstack/react-query';
import { getNode } from '@/lib/queries/getNode';

export default function NotFound() {
  const registerDictionary = useTranslations('actionModules.register');
  const { address } = useWallet();

  const pathname = usePathname();

  const nodeId = pathname.split('/').at(-1);

  const { data: openData } = useStakingBackendSuspenseQuery(getOpenNodes);
  const { data: stakedNodesData } = useStakingBackendQueryWithParams(
    getStakedNodes,
    {
      address: address!,
    },
    { enabled: !!address }
  );
  const { data: runningGlobalNode } = useQuery({
    queryKey: ['getNode', nodeId],
    queryFn: () => getNode({ address: nodeId! }),
    enabled: Boolean(nodeId),
  });

  const openNode = useMemo(() => {
    return openData?.nodes?.find((node) => areHexesEqual(node.service_node_pubkey, nodeId));
  }, [openData, nodeId]);

  const nodeStakedTo = useMemo(() => {
    return stakedNodesData?.nodes?.find((node) => areHexesEqual(node.service_node_pubkey, nodeId));
  }, [stakedNodesData, nodeId]);

  const nodeRunningElsewhere =
    runningGlobalNode && 'state' in runningGlobalNode && runningGlobalNode.state;

  return (
    <ActionModule background={1} title={registerDictionary('title')}>
      {registerDictionary('notFound.description')}
      <br />
      {nodeStakedTo ? (
        <>
          <span className="mb-4 text-lg font-medium">
            {registerDictionary.rich('notFound.foundRunningNode')}
          </span>
          <StakedNodeCard node={parseSessionNodeData(nodeStakedTo) as StakedNode} />
          <br />
        </>
      ) : nodeRunningElsewhere ? (
        <>
          <span className="mb-4 text-lg font-medium">
            {registerDictionary('notFound.foundRunningNodeOtherOperator')}
          </span>
          <StakedNodeCard node={runningGlobalNode as StakedNode} hideButton />
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
