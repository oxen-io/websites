'use client';

import { useTranslations } from 'next-intl';
import { getOpenNodes } from '@/lib/queries/getOpenNodes';
import ActionModule from '@/app/stake/ActionModule';
import { useMemo } from 'react';
import { useStakingBackendSuspenseQuery } from '@/lib/sent-staking-backend-client';
import { NodeStakingForm } from '@/app/stake/[nodeId]/NodeStaking';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const dictionary = useTranslations('notFound');
  const registerDictionary = useTranslations('actionModules.register');

  const pathname = usePathname();

  const nodeId = pathname.split('/').at(-2);

  const { data, isLoading } = useStakingBackendSuspenseQuery(getOpenNodes);

  const node = useMemo(() => {
    return data?.nodes?.find((node) => node.service_node_pubkey === nodeId);
  }, [data]);

  return (
    <ActionModule background={1} title={registerDictionary('title')}>
      {dictionary('description', { notFoundContentType: 'prepared registration' })}
      <br />
      {node ? (
        <>
          <span className="mb-4 text-lg font-medium">
            {registerDictionary('notFound.foundOpenNode')}
          </span>
          <NodeStakingForm node={node} />
        </>
      ) : null}
    </ActionModule>
  );
}
