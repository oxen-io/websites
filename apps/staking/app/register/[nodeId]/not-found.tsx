'use client';

import { useTranslations } from 'next-intl';
import ActionModule from '@/components/ActionModule';
import { NodeStakingForm } from '@/app/stake/[nodeId]/NodeStaking';
import { usePathname } from 'next/navigation';
import { StakedNodeCard } from '@/components/StakedNodeCard';
import { useRegisteredNode } from '@/hooks/useRegisteredNode';

export default function NotFound() {
  const registerDictionary = useTranslations('actionModules.register');
  const pathname = usePathname();
  const { found, openNode, stakedNode, runningNode, networkTime, blockHeight } = useRegisteredNode({
    nodeId: pathname.split('/').at(-1),
  });

  return (
    <ActionModule background={1} title={registerDictionary('title')}>
      {!found ? (
        registerDictionary('notFound.description')
      ) : stakedNode ? (
        <>
          <span className="mb-4 text-lg font-medium">
            {registerDictionary.rich('notFound.foundRunningNode')}
          </span>
          <StakedNodeCard node={stakedNode} networkTime={networkTime} blockHeight={blockHeight} />
        </>
      ) : runningNode ? (
        <>
          <span className="mb-4 text-lg font-medium">
            {registerDictionary('notFound.foundRunningNodeOtherOperator')}
          </span>
          <StakedNodeCard
            node={runningNode}
            networkTime={networkTime}
            blockHeight={blockHeight}
            hideButton
          />
        </>
      ) : openNode ? (
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
