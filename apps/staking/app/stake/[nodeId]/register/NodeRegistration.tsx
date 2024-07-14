'use client';

import { PubKey } from '@/components/PubKey';
import { formatDate, formatLocalizedRelativeTimeToNowClient } from '@/lib/locale-client';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { Loading } from '@session/ui/components/loading';
import { Button, ButtonSkeleton } from '@session/ui/ui/button';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { ActionModuleDivider, ActionModuleRow, ActionModuleRowSkeleton } from '../../ActionModule';
import { useStakingBackendQueryWithParams } from '@/lib/sent-staking-backend-client';
import type { LoadRegistrationsResponse } from '@session/sent-staking-js/client';
import { getPendingNodes } from '@/lib/queries/getPendingNodes';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { FEATURE_FLAG, useFeatureFlag } from '@/providers/feature-flag-provider';
import { SESSION_NODE } from '@/lib/constants';
import { formatBigIntTokenValue } from '@session/util/maths';
import { SENT_DECIMALS, SENT_SYMBOL } from '@session/contracts';
import { getDateFromUnixTimestampSeconds } from '@session/util/date';
import { Tooltip, TooltipContent, TooltipTrigger } from '@session/ui/ui/tooltip';
import { notFound } from 'next/navigation';

export default function NodeRegistration({ nodeId }: { nodeId: string }) {
  const showMockRegistration = useFeatureFlag(FEATURE_FLAG.MOCK_REGISTRATION);
  const showOneMockNode = useFeatureFlag(FEATURE_FLAG.MOCK_PENDING_NODES_ONE);
  const showTwoMockNodes = useFeatureFlag(FEATURE_FLAG.MOCK_PENDING_NODES_TWO);
  const showThreeMockNodes = useFeatureFlag(FEATURE_FLAG.MOCK_PENDING_NODES_THREE);
  const showManyMockNodes = useFeatureFlag(FEATURE_FLAG.MOCK_PENDING_NODES_MANY);
  const { address, isConnected } = useWallet();

  const { data, isLoading } = useStakingBackendQueryWithParams(
    getPendingNodes,
    { address: address! },
    isConnected
  );

  const node = useMemo(() => {
    if (
      showMockRegistration ||
      showOneMockNode ||
      showTwoMockNodes ||
      showThreeMockNodes ||
      showManyMockNodes
    ) {
      // TODO: Create mock pending nodes generator
      return {} as LoadRegistrationsResponse['registrations'][number];
    }
    return data?.registrations?.find((node) => node.pubkey_ed25519 === nodeId);
  }, [
    data?.registrations,
    showMockRegistration,
    showOneMockNode,
    showTwoMockNodes,
    showThreeMockNodes,
    showManyMockNodes,
  ]);

  return isLoading ? <Loading /> : node ? <NodeRegistrationForm node={node} /> : notFound();
}

export function NodeRegistrationForm({
  node,
}: {
  node: LoadRegistrationsResponse['registrations'][number];
}) {
  const dictionary = useTranslations('actionModules.register');
  const registerCardDictionary = useTranslations('nodeCard.pending');
  const sessionNodeDictionary = useTranslations('sessionNodes.general');
  const actionModuleSharedDictionary = useTranslations('actionModules.shared');

  const stakeAmount = formatBigIntTokenValue(BigInt(SESSION_NODE.FULL_STAKE_AMOUNT), SENT_DECIMALS);
  const preparationDate = getDateFromUnixTimestampSeconds(node.timestamp);

  return (
    <div className="flex flex-col gap-4">
      <ActionModuleRow
        label={sessionNodeDictionary('publicKeyShort')}
        tooltip={sessionNodeDictionary('publicKeyDescription')}
      >
        <PubKey pubKey={node.pubkey_ed25519} force="collapse" alwaysShowCopyButton />
      </ActionModuleRow>
      <ActionModuleDivider />
      <ActionModuleRow
        label={registerCardDictionary('type')}
        tooltip={registerCardDictionary('typeDescription')}
      >
        {registerCardDictionary(node.type === 'solo' ? 'solo' : 'multi')}
      </ActionModuleRow>
      <ActionModuleDivider />
      <ActionModuleRow
        label={dictionary('preparedAtTimestamp')}
        tooltip={dictionary('preparedAtTimestampDescription')}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              {formatLocalizedRelativeTimeToNowClient(preparationDate, { addSuffix: true })}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {formatDate(preparationDate, {
              dateStyle: 'full',
              timeStyle: 'full',
            })}
          </TooltipContent>
        </Tooltip>
      </ActionModuleRow>
      <ActionModuleDivider />
      {node.type === 'solo' ? (
        <ActionModuleRow
          label={actionModuleSharedDictionary('stakeAmount')}
          tooltip={actionModuleSharedDictionary('stakeAmountDescription')}
        >
          {stakeAmount} {SENT_SYMBOL}
        </ActionModuleRow>
      ) : null}
      <ActionModuleDivider />
      <Button data-testid={ButtonDataTestId.Stake_Submit} rounded="lg" size="lg">
        {dictionary('button.submit', { amount: stakeAmount })}
      </Button>
    </div>
  );
}

export function NodeRegistrationFormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <ActionModuleRowSkeleton />
      <ActionModuleDivider />
      <ActionModuleRowSkeleton />
      <ActionModuleDivider />
      <ActionModuleRowSkeleton />
      <ActionModuleDivider />
      <ActionModuleRowSkeleton />
      <ActionModuleDivider />
      <ButtonSkeleton rounded="lg" size="lg" />
    </div>
  );
}
