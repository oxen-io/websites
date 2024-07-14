import ScreenContainer from '@/components/ScreenContainer';
import { ModuleGrid } from '@session/ui/components/ModuleGrid';
import type { ReactNode } from 'react';
import OpenNodesModule from '@/app/stake/OpenNodesModule';
import PendingNodesModule from '@/app/stake/PendingNodesModule';

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <ScreenContainer>
      <ModuleGrid size="lg" className="h-full px-4 md:auto-rows-auto md:px-10">
        <div className="md:max-h-screen-without-header col-span-1 h-full pb-8 md:mt-0">
          {children}
        </div>
        <div className="md:max-h-screen-without-header col-span-2 mt-12 flex h-full flex-col gap-14 pb-8 md:mt-0 md:gap-6">
          <PendingNodesModule />
          <OpenNodesModule />
        </div>
      </ModuleGrid>
    </ScreenContainer>
  );
}
