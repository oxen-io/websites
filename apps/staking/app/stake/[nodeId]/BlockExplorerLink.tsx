'use client';

import { LinkOutIcon } from '@session/ui/icons/LinkOutIcon';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useStakingBackendSuspenseQuery } from '@/lib/sent-staking-backend-client';
import { getOpenNodes } from '@/lib/queries/getOpenNodes';
import { useMemo } from 'react';
import { Loading } from '@session/ui/components/loading';

export const BlockExplorerLink = ({ nodeId }: { nodeId: string }) => {
  const { data, isLoading } = useStakingBackendSuspenseQuery(getOpenNodes);

  const node = useMemo(() => {
    return data?.nodes?.find((node) => node.service_node_pubkey === nodeId);
  }, [data]);

  return isLoading ? (
    <Loading />
  ) : node ? (
    <Link href={`/explorer/${node.contract}`} target="_blank">
      <BlockExplorerLinkText />
    </Link>
  ) : null;
};

export const BlockExplorerLinkText = () => {
  const dictionary = useTranslations('actionModules.node');
  return (
    <span className="text-session-green fill-session-green inline-flex items-center gap-1 align-middle">
      <span className="hidden sm:inline-flex xl:hidden 2xl:inline-flex">
        {dictionary('viewOnExplorer')}
      </span>
      <span className="inline-flex sm:hidden xl:inline-flex 2xl:hidden">
        {dictionary('viewOnExplorerShort')}
      </span>
      <LinkOutIcon className="h-4 w-4" />
    </span>
  );
};
