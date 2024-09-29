import { useTranslations } from 'next-intl';
import ActionModule from '@/components/ActionModule';
import NodeRegistration, { NodeRegistrationFormSkeleton } from './NodeRegistration';
import { Suspense } from 'react';

interface NodePageParams {
  params: {
    nodeId: string;
  };
}

export default function NodePage({ params }: NodePageParams) {
  const { nodeId } = params;
  const dictionary = useTranslations('actionModules.register');

  return (
    <ActionModule
      background={2}
      title={dictionary('title')}
      className="h-screen-without-header md:h-full"
    >
      <Suspense fallback={<NodeRegistrationFormSkeleton />}>
        <NodeRegistration nodeId={nodeId} />
      </Suspense>
    </ActionModule>
  );
}
