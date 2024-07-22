'use client';

import {
  Module,
  ModuleContent,
  ModuleHeader,
  ModuleText,
  ModuleTitle,
} from '@session/ui/components/Module';
import { useTranslations } from 'next-intl';

export default function PriceModule() {
  const dictionary = useTranslations('modules.price');
  const generalDictionary = useTranslations('general');
  const titleFormat = useTranslations('modules.title');

  const title = dictionary('title');

  return (
    <Module size="lg" className="hidden flex-grow lg:flex">
      <ModuleHeader variant="overlay">
        <ModuleTitle>{titleFormat('format', { title })}</ModuleTitle>
        <ModuleText>{generalDictionary('comingSoon')}</ModuleText>
      </ModuleHeader>
      <ModuleContent className="h-full min-h-12"></ModuleContent>
    </Module>
  );
}
