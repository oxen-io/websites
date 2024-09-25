import { StakedNodesWithAddress } from '@/app/mystakes/modules/StakedNodesModule';
import { isAddress } from 'viem';
import { notFound } from 'next/navigation';
import { ModuleGrid } from '@session/ui/components/ModuleGrid';
import BalanceModule from '@/app/mystakes/modules/BalanceModule';
import TotalRewardsModule from '@/app/mystakes/modules/TotalRewardsModule';
import UnclaimedTokensModule from '@/app/mystakes/modules/UnclaimedTokensModule';

export default function Page({ params: { address } }: { params: { address: string } }) {
  return isAddress(address) ? (
    <div className="flex flex-col gap-4">
      <ModuleGrid>
        <BalanceModule addressOverride={address} />
        <TotalRewardsModule addressOverride={address} />
        <UnclaimedTokensModule addressOverride={address} />
      </ModuleGrid>
      <StakedNodesWithAddress address={address} />
    </div>
  ) : (
    notFound()
  );
}
