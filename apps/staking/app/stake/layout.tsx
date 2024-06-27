import ScreenContainer from '@/components/ScreenContainer';
import { ModuleGrid } from '@session/ui/components/ModuleGrid';
import OpenNodesModule from './OpenNodes';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ScreenContainer>
      <ModuleGrid size="lg" className="h-full px-4 md:auto-rows-auto md:px-10">
        <div className="md:max-h-screen-minus-header col-span-1 h-full py-6">{children}</div>
        <div className="md:max-h-screen-minus-header col-span-2 h-full py-6">
          <ModuleGrid variant="section" colSpan={2} className="h-full">
            <OpenNodesModule />
          </ModuleGrid>
        </div>
      </ModuleGrid>
    </ScreenContainer>
  );
}
