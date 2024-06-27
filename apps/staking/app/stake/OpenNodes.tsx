'use client';

import { OpenNodeCard } from '@/components/OpenNodeCard';
import { useSessionStakingQuery } from '@/providers/sent-staking-provider';
import {
  ModuleGridContent,
  ModuleGridHeader,
  ModuleGridTitle,
} from '@session/ui/components/ModuleGrid';
import { Loading } from '@session/ui/components/loading';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { useTranslations } from 'next-intl';

export default function OpenNodesModule() {
  const dictionary = useTranslations('modules.openNodes');
  return (
    <>
      <ModuleGridHeader>
        <ModuleGridTitle>{dictionary('title')}</ModuleGridTitle>
      </ModuleGridHeader>
      <OpenNodes />
    </>
  );
}

function OpenNodes() {
  const { address } = useWallet();
  const { data, isLoading } = useSessionStakingQuery({
    query: 'getOpenNodes',
    args: { userAddress: address! },
  });
  return isLoading || !data ? (
    <Loading />
  ) : (
    <ModuleGridContent className="h-full md:overflow-y-auto">
      {data.nodes.map((node) => (
        <OpenNodeCard key={node.pubKey} node={node} />
      ))}
    </ModuleGridContent>
  );
}
