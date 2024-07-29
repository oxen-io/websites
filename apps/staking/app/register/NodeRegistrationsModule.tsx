import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import NodesListModule, { NodesListSkeleton } from '@/components/NodesListModule';
import NodeRegistrations from '@/app/register/NodeRegistrations';

export default async function NodeRegistrationsModule() {
  const dictionary = await getTranslations('modules.nodeRegistrations');

  return (
    <NodesListModule title={dictionary('title')}>
      <Suspense fallback={<NodesListSkeleton />}>
        <NodeRegistrations />
      </Suspense>
    </NodesListModule>
  );
}
