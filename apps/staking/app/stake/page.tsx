import {
  Module,
  ModuleContent,
  ModuleHeader,
  ModuleText,
  ModuleTitle,
} from '@session/ui/components/Module';
import { ModuleGrid, ModuleGridHeader, ModuleGridTitle } from '@session/ui/components/ModuleGrid';
import { useTranslations } from 'next-intl';
import OpenNodes from './OpenNodes';

export default function Page() {
  const dictionary = useTranslations('stakeNow');
  return (
    <ModuleGrid size="lg" className="h-full w-screen px-10 py-6">
      <ModuleGrid variant="section" colSpan={1}>
        <Module size="lg" className="hidden h-full lg:flex">
          <ModuleHeader variant="overlay">
            <ModuleTitle>Price</ModuleTitle>
            <ModuleText>$XX.XX USD</ModuleText>
          </ModuleHeader>
          <ModuleContent className="h-[300px]"></ModuleContent>
        </Module>
      </ModuleGrid>
      <ModuleGrid variant="section" colSpan={2} className="h-full">
        <ModuleGridHeader>
          <ModuleGridTitle>{dictionary('title')}</ModuleGridTitle>
        </ModuleGridHeader>
        <OpenNodes />
      </ModuleGrid>
    </ModuleGrid>
  );
}
