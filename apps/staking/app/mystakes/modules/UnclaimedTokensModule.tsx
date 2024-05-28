'use client';
import { Module, ModuleText, ModuleTitle } from '@session/ui/components/Module';
/* import { useSessionStakingQuery } from '@/providers/sent-staking-provider';
import { useAccount } from 'wagmi';
import { ModuleQueryText } from '@/components/ModuleDynamic';
import { toast } from '@session/ui/lib/sonner';
import { useEffect } from 'react'; */

export default function UnclaimedTokensModule() {
  // const { address } = useAccount();
  return (
    <Module>
      <ModuleTitle>Unclaimed Tokens:</ModuleTitle>
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
