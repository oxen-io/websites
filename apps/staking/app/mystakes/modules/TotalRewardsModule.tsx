'use client';
import { Module, ModuleTitle, ModuleText } from '@session/ui/components/Module';
import { useTranslations } from 'next-intl';
export default function TotalRewardsModule() {
  const dictionary = useTranslations('modules.totalRewards');
  return (
    <Module>
      <ModuleTitle>{dictionary('title')}</ModuleTitle>
      <ModuleText>0</ModuleText>
    </Module>
  );
}
