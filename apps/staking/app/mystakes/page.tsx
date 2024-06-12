import { ModuleGrid } from '@session/ui/components/ModuleGrid';
import BalanceModule from './modules/BalanceModule';
import ClaimTokensModule from './modules/ClaimTokensModule';
import DailyNodeReward from './modules/DailyNodeReward';
import StakedNodesModule from './modules/StakedNodesModule';
import TotalRewardsModule from './modules/TotalRewardsModule';
import UnclaimedTokensModule from './modules/UnclaimedTokensModule';

export default function Page() {
  return (
    <ModuleGrid size="lg" className="h-full px-10 py-6">
      <ModuleGrid className="h-min min-h-0">
        <BalanceModule />
        <DailyNodeReward />
        <TotalRewardsModule />
        <UnclaimedTokensModule />
        <ClaimTokensModule />
        {/*         <PriceModule /> */}
      </ModuleGrid>
      <ModuleGrid variant="section" colSpan={2}>
        <StakedNodesModule />
      </ModuleGrid>
    </ModuleGrid>
  );
}
