'use client';

import { URL } from '@/lib/constants';
import { externalLink } from '@/lib/locale-defaults';
import { Module, ModuleText, ModuleTitle, ModuleTooltip } from '@session/ui/components/Module';
import { useTranslations } from 'next-intl';
export default function TotalRewardsModule() {
  const dictionary = useTranslations('modules.totalRewards');
  // const toastDictionary = useTranslations('modules.toast');
  const titleFormat = useTranslations('modules.title');

  const title = dictionary('title');

  return (
    <Module>
      <ModuleTooltip>
        {dictionary.rich('description', { link: externalLink(URL.LEARN_MORE_TOTAL_REWARDS) })}
      </ModuleTooltip>
      <ModuleTitle>{titleFormat('format', { title })}</ModuleTitle>
      <ModuleText>0</ModuleText>
    </Module>
  );
}
