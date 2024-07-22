import { useTranslations } from 'next-intl';
import ActionModule from '../../ActionModule';
import NodeRegistration, { NodeRegistrationFormSkeleton } from './NodeRegistration';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { stakingBackendPrefetchQuery } from '@/lib/sent-staking-backend-server';
import { getOpenNodes } from '@/lib/queries/getOpenNodes';

interface NodePageParams {
  params: {
    nodeId: string;
  };
}

export default function NodePage({ params }: NodePageParams) {
  const { nodeId } = params;
  const dictionary = useTranslations('actionModules.register');

  const { queryClient } = stakingBackendPrefetchQuery(getOpenNodes);

  return (
    <ActionModule
      background={2}
      title={dictionary('title')}
      className="h-screen-without-header md:h-full"
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<NodeRegistrationFormSkeleton />}>
          <NodeRegistration nodeId={nodeId} />
        </Suspense>
      </HydrationBoundary>
    </ActionModule>
  );
}
