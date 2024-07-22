import { ModuleGrid, ModuleGridHeader, ModuleGridTitle } from '@session/ui/components/ModuleGrid';
import { getTranslations } from 'next-intl/server';
import OpenNodes, { OpenNodesSkeleton } from '@/app/stake/OpenNodes';
import { stakingBackendPrefetchQuery } from '@/lib/sent-staking-backend-server';
import { getOpenNodes } from '@/lib/queries/getOpenNodes';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

export default async function OpenNodesModule() {
  const dictionary = await getTranslations('modules.openNodes');

  const { queryClient } = stakingBackendPrefetchQuery(getOpenNodes);

  return (
    <ModuleGrid variant="section" colSpan={2} className="h-full">
      <ModuleGridHeader>
        <ModuleGridTitle>{dictionary('title')}</ModuleGridTitle>
      </ModuleGridHeader>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<OpenNodesSkeleton />}>
          <OpenNodes />
        </Suspense>
      </HydrationBoundary>
    </ModuleGrid>
  );
}
