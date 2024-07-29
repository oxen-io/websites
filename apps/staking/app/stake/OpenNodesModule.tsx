import { getTranslations } from 'next-intl/server';
import { stakingBackendPrefetchQuery } from '@/lib/sent-staking-backend-server';
import { getOpenNodes } from '@/lib/queries/getOpenNodes';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import NodesListModule, { NodesListSkeleton } from '@/components/NodesListModule';
import OpenNodes from '@/app/stake/OpenNodes';

export default async function OpenNodesModule() {
  const dictionary = await getTranslations('modules.openNodes');
  const { queryClient } = stakingBackendPrefetchQuery(getOpenNodes);

  return (
    <NodesListModule title={dictionary('title')}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<NodesListSkeleton />}>
          <OpenNodes />
        </Suspense>
      </HydrationBoundary>
    </NodesListModule>
  );
}
