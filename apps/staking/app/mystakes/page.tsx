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
    <ModuleGrid size="lg" className="w-screen px-10 py-6">
      <ModuleGrid>
        <BalanceModule />
        <DailyNodeReward />
        <TotalRewardsModule />
        <UnclaimedTokensModule />
        <ClaimTokensModule />
        <PriceModule />
      </ModuleGrid>
      <ModuleGrid variant="section" colSpan={2}>
        <StakedNodesModule />
      </ModuleGrid>
    </ModuleGrid>
  );
}
