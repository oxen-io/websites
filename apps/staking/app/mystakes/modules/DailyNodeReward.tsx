'use client';

import { ModuleDynamicContractReadText } from '@/components/ModuleDynamic';
import useDailyNodeReward from '@/hooks/daily-node-reward';
import { URL } from '@/lib/constants';
import { externalLink } from '@/lib/locale-defaults';
import { Module, ModuleTitle, ModuleTooltip } from '@session/ui/components/Module';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export default function DailyNodeReward() {
  const { dailyNodeReward, status, refetch } = useDailyNodeReward();
  const dictionary = useTranslations('modules.dailyRewards');
  const toastDictionary = useTranslations('modules.toast');
  const titleFormat = useTranslations('modules.title');

  const title = dictionary('title');

  const data = useMemo(() => dailyNodeReward?.toLocaleString(), [dailyNodeReward]);

  return (
    <Module>
      <ModuleTooltip>
        {dictionary.rich('description', { link: externalLink(URL.LEARN_MORE_DAILY_REWARDS) })}
      </ModuleTooltip>
      <ModuleTitle>{titleFormat('format', { title })}</ModuleTitle>
      <ModuleDynamicContractReadText
        status={status}
        fallback={0}
        errorToast={{
          messages: {
            error: toastDictionary('error', { module: title }),
            refetching: toastDictionary('refetching'),
            success: toastDictionary('refetchSuccess'),
          },
          refetch,
        }}
      >
        {data}
      </ModuleDynamicContractReadText>
    </Module>
  );
}
