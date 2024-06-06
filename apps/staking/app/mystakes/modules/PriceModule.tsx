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
  return (
    <Module size="lg" className="hidden lg:flex">
      <ModuleHeader variant="overlay">
        <ModuleTitle>{dictionary('title')}</ModuleTitle>
        <ModuleText>{generalDictionary('comingSoon')}</ModuleText>
      </ModuleHeader>
      <ModuleContent className="h-[300px]"></ModuleContent>
    </Module>
  );
}
