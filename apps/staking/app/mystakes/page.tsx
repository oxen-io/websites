import { ButtonDataTestId } from '@/testing/data-test-ids';
import {
  Module,
  ModuleContent,
  ModuleHeader,
  ModuleText,
  ModuleTitle,
} from '@session/ui/components/Module';
import { ModuleGrid, ModuleGridHeader, ModuleGridTitle } from '@session/ui/components/ModuleGrid';
import { Button } from '@session/ui/components/ui/button';
import SessionNodes from './SessionNodes';
import BalanceModule from './modules/BalanceModule';
import ClaimTokensModule from './modules/ClaimTokensModule';
import DailyNodeReward from './modules/DailyNodeReward';
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
        <Module size="lg" className="hidden lg:flex">
          <ModuleHeader variant="overlay">
            <ModuleTitle>Price</ModuleTitle>
            <ModuleText>$XX.XX USD</ModuleText>
          </ModuleHeader>
          <ModuleContent className="h-[300px]"></ModuleContent>
        </Module>
      </ModuleGrid>
      <ModuleGrid variant="section" colSpan={2}>
        <ModuleGridHeader>
          <ModuleGridTitle>My Stakes</ModuleGridTitle>
          <Button title="NEW STAKE" data-testid={ButtonDataTestId.New_Stake} />
        </ModuleGridHeader>
        <SessionNodes />
      </ModuleGrid>
    </ModuleGrid>
  );
}
