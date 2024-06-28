'use client';

import { ModuleContractReadText } from '@/components/ModuleDynamic';
import useDailyNodeReward from '@/hooks/daily-node-reward';
import { Module, ModuleTitle, ModuleTooltip } from '@session/ui/components/Module';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export default function DailyNodeReward() {
  const { dailyNodeReward, status, refetch } = useDailyNodeReward();
  const dictionary = useTranslations('modules.dailyRewards');

  const data = useMemo(() => dailyNodeReward?.toLocaleString(), [dailyNodeReward]);

  return (
    <Module>
      <ModuleTooltip>Example tooltip</ModuleTooltip>
      <ModuleTitle>{dictionary('title')}</ModuleTitle>
      <ModuleContractReadText
        status={status}
        fallback={0}
        errorToast={{
          messages: {
            error: dictionary('error'),
            refetching: dictionary('refetching'),
            success: dictionary('refetchSuccess'),
          },
          refetch,
        }}
      >
        {data}
      </ModuleContractReadText>
    </Module>
  );
}
