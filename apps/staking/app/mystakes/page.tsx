import { ModuleGrid } from '@session/ui/components/ModuleGrid';
import BalanceModule from './modules/BalanceModule';
import ClaimTokensModule from './modules/ClaimTokensModule';
import DailyNodeReward from './modules/DailyNodeReward';
import PriceModule from './modules/PriceModule';
import StakedNodesModule from './modules/StakedNodesModule';
import TotalRewardsModule from './modules/TotalRewardsModule';
import UnclaimedTokensModule from './modules/UnclaimedTokensModule';

export default function Page() {
  return (
    <ModuleGrid size="lg" className="h-full px-4 md:auto-rows-auto md:px-10">
      <div className="md:max-h-screen-without-header col-span-1 flex h-full min-h-max flex-col gap-4 py-6 md:overflow-y-auto md:overflow-x-hidden">
        <ModuleGrid>
          <BalanceModule />
          <DailyNodeReward />
          <TotalRewardsModule />
          <UnclaimedTokensModule />
          <ClaimTokensModule />
        </ModuleGrid>
        <PriceModule />
      </div>
      <div className="md:max-h-screen-without-header col-span-2 h-full py-6">
        <ModuleGrid variant="section" colSpan={2} className="h-full">
          <StakedNodesModule />
        </ModuleGrid>
      </div>
    </ModuleGrid>
  );
}
