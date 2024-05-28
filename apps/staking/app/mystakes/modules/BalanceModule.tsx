'use client';
import useSentBalance from '@/hooks/balance';
import { Module, ModuleTitle } from '@session/ui/components/Module';
import { ModuleContractReadText } from '@/components/ModuleDynamic';
import { useTranslations } from 'next-intl';

export default function BalanceModule() {
  const { balance, status, refetch } = useSentBalance();
  const dictionary = useTranslations('modules.balance');
  return (
    <Module size="lg" variant="hero">
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
        {balance}
      </ModuleContractReadText>
    </Module>
  );
}
