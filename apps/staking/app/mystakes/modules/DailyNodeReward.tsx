'use client';
import useDailyNodeReward from '@/hooks/daily-node-reward';
import { Module, ModuleTitle } from '@session/ui/components/Module';
import { ModuleContractReadText } from '@/components/ModuleDynamic';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function DailyNodeReward() {
  const { dailyNodeReward, status, refetch } = useDailyNodeReward();
  const dictionary = useTranslations('modules.dailyRewards');

  const data = useMemo(() => dailyNodeReward?.toLocaleString(), [dailyNodeReward]);

  return (
    <Module>
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
