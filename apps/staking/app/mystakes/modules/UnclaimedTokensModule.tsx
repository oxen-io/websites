'use client';

import { DYNAMIC_MODULE, HANDRAIL_THRESHOLD, URL } from '@/lib/constants';
import { externalLink } from '@/lib/locale-defaults';
import { Module, ModuleTitle, ModuleTooltip } from '@session/ui/components/Module';
import { useTranslations } from 'next-intl';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { useStakingBackendQueryWithParams } from '@/lib/sent-staking-backend-client';
import { getStakedNodes } from '@/lib/queries/getStakedNodes';
import { useMemo } from 'react';
import type { QUERY_STATUS } from '@/lib/query';
import {
  getVariableFontSizeForSmallModule,
  ModuleDynamicQueryText,
} from '@/components/ModuleDynamic';
import { formatSENTBigInt } from '@session/contracts/hooks/SENT';

export const useUnclaimedTokens = () => {
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

  const unclaimedRewards = useMemo(
    () => (data?.wallet ? data.wallet.rewards - data.wallet.contract_claimed : undefined),
    [data?.wallet?.rewards, data?.wallet?.contract_claimed]
  );

  const formattedUnclaimedRewardsAmount = useMemo(
    () => formatSENTBigInt(unclaimedRewards, DYNAMIC_MODULE.SENT_ROUNDED_DECIMALS),
    [unclaimedRewards]
  );

  const canClaim = Boolean(
    status === 'success' &&
      unclaimedRewards &&
      unclaimedRewards >= BigInt(HANDRAIL_THRESHOLD.CLAIM_REWARDS_AMOUNT)
  );

  return { status, refetch, unclaimedRewards, formattedUnclaimedRewardsAmount, canClaim };
};

export default function UnclaimedTokensModule() {
  const dictionary = useTranslations('modules.unclaimedTokens');
  const toastDictionary = useTranslations('modules.toast');
  const titleFormat = useTranslations('modules.title');
  const title = dictionary('title');

  const { formattedUnclaimedRewardsAmount, status, refetch } = useUnclaimedTokens();

  return (
    <Module>
      <ModuleTooltip>
        {dictionary.rich('description', { link: externalLink(URL.LEARN_MORE_UNCLAIMED_REWARDS) })}
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
          fontSize: getVariableFontSizeForSmallModule(formattedUnclaimedRewardsAmount.length),
        }}
      >
        {formattedUnclaimedRewardsAmount}
      </ModuleDynamicQueryText>
    </Module>
  );
}
