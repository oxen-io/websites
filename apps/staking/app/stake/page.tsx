import {
  Module,
  ModuleContent,
  ModuleHeader,
  ModuleText,
  ModuleTitle,
} from '@session/ui/components/Module';
import { ModuleGrid, ModuleGridHeader, ModuleGridTitle } from '@session/ui/components/ModuleGrid';

export default function Page() {
  return (
    <ModuleGrid size="lg" className="w-screen px-10 py-6">
      <ModuleGrid variant="section" colSpan={2}>
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
          <ModuleGridTitle>Open Session Nodes</ModuleGridTitle>
        </ModuleGridHeader>
        {/* <OpenSessionNodes /> */}
      </ModuleGrid>
    </ModuleGrid>
  );
}
