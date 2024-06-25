'use client';
import { Module, ModuleText, ModuleTitle, ModuleTooltip } from '@session/ui/components/Module';
import { useTranslations } from 'next-intl';
export default function TotalRewardsModule() {
  const dictionary = useTranslations('modules.totalRewards');
  return (
    <Module>
      <ModuleTooltip>Example tooltip</ModuleTooltip>
      <ModuleTitle>{dictionary('title')}</ModuleTitle>
      <ModuleText>0</ModuleText>
    </Module>
  );
}
