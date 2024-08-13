'use client';

import { DYNAMIC_MODULE, URL } from '@/lib/constants';
import { externalLink } from '@/lib/locale-defaults';
import { Module, ModuleTitle, ModuleTooltip } from '@session/ui/components/Module';
import { useTranslations } from 'next-intl';
import { useStakingBackendQueryWithParams } from '@/lib/sent-staking-backend-client';
import { getStakedNodes } from '@/lib/queries/getStakedNodes';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import {
  getVariableFontSizeForSmallModule,
  ModuleDynamicQueryText,
} from '@/components/ModuleDynamic';
import type { QUERY_STATUS } from '@/lib/query';
import { useMemo } from 'react';
import { formatSENTBigInt } from '@session/contracts/hooks/SENT';

export default function TotalRewardsModule() {
  const dictionary = useTranslations('modules.totalRewards');
  const toastDictionary = useTranslations('modules.toast');
  const titleFormat = useTranslations('modules.title');
  const title = dictionary('title');

  const { address } = useWallet();

  const { data, status, refetch } = useStakingBackendQueryWithParams(
    getStakedNodes,
    {
      address: address!,
    },
    {
      enabled: !!address,
    }
  );

  const formattedTotalRewardsAmount = useMemo(() => {
    return formatSENTBigInt(data?.wallet?.rewards, DYNAMIC_MODULE.SENT_ROUNDED_DECIMALS);
  }, [data?.wallet?.rewards]);

  return (
    <Module>
      <ModuleTooltip>
        {dictionary.rich('description', { link: externalLink(URL.LEARN_MORE_TOTAL_REWARDS) })}
      </ModuleTooltip>
      <ModuleTitle>{titleFormat('format', { title })}</ModuleTitle>
      <ModuleDynamicQueryText
        status={status as QUERY_STATUS}
        fallback={0}
        errorToast={{
          messages: {
            error: toastDictionary('error', { module: title }),
            refetching: toastDictionary('refetching'),
            success: toastDictionary('refetchSuccess', { module: title }),
          },
          refetch,
        }}
        style={{
          fontSize: getVariableFontSizeForSmallModule(formattedTotalRewardsAmount.length),
        }}
      >
        {formattedTotalRewardsAmount}
      </ModuleDynamicQueryText>
    </Module>
  );
}
