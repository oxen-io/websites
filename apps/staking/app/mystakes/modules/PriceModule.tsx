'use client';

import {
  Module,
  ModuleContent,
  ModuleHeader,
  ModuleText,
  ModuleTitle,
  ModuleTooltip,
} from '@session/ui/components/Module';
import { useTranslations } from 'next-intl';

export default function PriceModule() {
  const dictionary = useTranslations('modules.price');
  const generalDictionary = useTranslations('general');
  return (
    <Module size="lg" className="hidden flex-grow lg:flex">
      <ModuleTooltip>Example tooltip</ModuleTooltip>
      <ModuleHeader variant="overlay">
        <ModuleTitle>{dictionary('title')}</ModuleTitle>
        <ModuleText>{generalDictionary('comingSoon')}</ModuleText>
      </ModuleHeader>
      <ModuleContent className="h-full min-h-12"></ModuleContent>
    </Module>
  );
}
