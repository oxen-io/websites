'use client';

import { URL } from '@/lib/constants';
import { externalLink } from '@/lib/locale-defaults';
import { Module, ModuleText, ModuleTitle, ModuleTooltip } from '@session/ui/components/Module';
import { useTranslations } from 'next-intl';
/* import { useSessionStakingQuery } from '@/providers/sent-staking-provider';
import { useAccount } from 'wagmi';
import { ModuleQueryText } from '@/components/ModuleDynamic';
import { toast } from '@session/ui/lib/sonner';
import { useEffect } from 'react'; */

export default function UnclaimedTokensModule() {
  const dictionary = useTranslations('modules.unclaimedTokens');
  const titleFormat = useTranslations('modules.title');

  const title = dictionary('title');

  // const { address } = useAccount();
  return (
    <Module>
      <ModuleTooltip>
        {dictionary.rich('description', { link: externalLink(URL.LEARN_MORE_UNCLAIMED_REWARDS) })}
      </ModuleTooltip>
      <ModuleTitle>{titleFormat('format', { title })}</ModuleTitle>
      <ModuleText>0</ModuleText>
      {/* {address ? <UnclaimedTokensQueryContainer address={address} /> : null} */}
    </Module>
  );
}
/* 
function UnclaimedTokensQueryContainer({ address }: { address: any }) {
  const { data, status } = useSessionStakingQuery({ query: 'getRewardsForEthWallet', inputs: { address } });

  return (
    <ModuleQueryText fallback={0} status={status} errorToast="Failed to fetch unclaimed tokens">
      {data}
    </ModuleQueryText>
  );

  return 0;
} */
