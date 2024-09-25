'use client';

import { PubKey } from '@session/ui/components/PubKey';
import { formatDate, formatLocalizedRelativeTimeToNowClient } from '@/lib/locale-client';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { Button, ButtonSkeleton } from '@session/ui/ui/button';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import { ActionModuleRow, ActionModuleRowSkeleton } from '@/components/ActionModule';
import { useStakingBackendQueryWithParams } from '@/lib/sent-staking-backend-client';
import type { LoadRegistrationsResponse } from '@session/sent-staking-js/client';
import { getNodeRegistrations } from '@/lib/queries/getNodeRegistrations';
import { QUERY, SESSION_NODE } from '@/lib/constants';
import { getDateFromUnixTimestampSeconds } from '@session/util/date';
import { notFound } from 'next/navigation';
import { generateMockRegistrations } from '@session/sent-staking-js/test';
import useRegisterNode from '@/hooks/useRegisterNode';
import { StakedNodeCard } from '@/components/StakedNodeCard';
import { AlertTooltip, Tooltip } from '@session/ui/ui/tooltip';
import { areHexesEqual } from '@session/util/string';
import { toast } from '@session/ui/lib/toast';
import { RegistrationPausedInfo } from '@/components/RegistrationPausedInfo';
import { useFeatureFlag, useRemoteFeatureFlagQuery } from '@/lib/feature-flags-client';
import { FEATURE_FLAG, REMOTE_FEATURE_FLAG } from '@/lib/feature-flags';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { Progress, PROGRESS_STATUS } from '@session/ui/motion/progress';
import { formatSENTBigInt } from '@session/contracts/hooks/SENT';
import { useRegisteredNode } from '@/hooks/useRegisteredNode';
import { NodeStakingForm } from '@/app/stake/[nodeId]/NodeStaking';
import { isProduction } from '@/lib/env';
import { getStakedNodes } from '@/lib/queries/getStakedNodes';
import { useWalletButton } from '@session/wallet/providers/wallet-button-provider';

export default function NodeRegistration({ nodeId }: { nodeId: string }) {
  const showMockRegistration = useFeatureFlag(FEATURE_FLAG.MOCK_REGISTRATION);
  const showOneMockNode = useFeatureFlag(FEATURE_FLAG.MOCK_PENDING_NODES_ONE);
  const showTwoMockNodes = useFeatureFlag(FEATURE_FLAG.MOCK_PENDING_NODES_TWO);
  const showThreeMockNodes = useFeatureFlag(FEATURE_FLAG.MOCK_PENDING_NODES_THREE);
  const showManyMockNodes = useFeatureFlag(FEATURE_FLAG.MOCK_PENDING_NODES_MANY);
  const { address, isConnected } = useWallet();

  const { data: registrationsData, isLoading: isLoadingRegistrations } =
    useStakingBackendQueryWithParams(
      getNodeRegistrations,
      { address: address! },
      {
        enabled: isConnected,
        staleTime: isProduction
          ? QUERY.STALE_TIME_REGISTRATIONS_LIST
          : QUERY.STALE_TIME_REGISTRATIONS_LIST_DEV,
      }
    );

  const { data: stakesData, isLoading: isLoadingStakes } = useStakingBackendQueryWithParams(
    getStakedNodes,
    { address: address! },
    {
      enabled: isConnected,
      staleTime: isProduction
        ? QUERY.STALE_TIME_REGISTRATIONS_LIST
        : QUERY.STALE_TIME_REGISTRATIONS_LIST_DEV,
    }
  );

  const node = useMemo(() => {
    if (
      showMockRegistration ||
      showOneMockNode ||
      showTwoMockNodes ||
      showThreeMockNodes ||
      showManyMockNodes
    ) {
      return generateMockRegistrations({ userAddress: address!, numberOfNodes: 1 })[0];
    }

    if (isLoadingRegistrations || isLoadingStakes) {
      return null;
    }

    const stakedNodeEd25519Pubkeys = stakesData?.stakes.map(
      ({ service_node_pubkey }) => service_node_pubkey
    );

    return registrationsData?.registrations
      .filter(({ pubkey_ed25519 }) => !stakedNodeEd25519Pubkeys?.includes(pubkey_ed25519))
      .find((node) => areHexesEqual(node.pubkey_ed25519, nodeId));
  }, [
    isLoadingRegistrations,
    isLoadingStakes,
    registrationsData?.registrations,
    stakesData?.stakes,
    showMockRegistration,
    showOneMockNode,
    showTwoMockNodes,
    showThreeMockNodes,
    showManyMockNodes,
    nodeId,
  ]);

  return isLoadingRegistrations || isLoadingStakes ? (
    <NodeRegistrationFormSkeleton />
  ) : node ? (
    <NodeRegistrationForm node={node} />
  ) : (
    notFound()
  );
}

function RegisterButton({
  blsPubKey,
  blsSignature,
  nodePubKey,
  userSignature,
  stakeAmount,
  stakeAmountString,
  disabled,
  isRegistrationPausedFlagEnabled,
}: {
  blsPubKey: string;
  blsSignature: string;
  nodePubKey: string;
  userSignature: string;
  stakeAmount: bigint;
  stakeAmountString: string;
  disabled?: boolean;
  isRegistrationPausedFlagEnabled?: boolean;
}) {
  const dictionary = useTranslations('actionModules.register');
  const dictionaryStage = useTranslations('actionModules.register.stage');

  const registerNodeArgs = useMemo(
    () => ({
      blsPubKey,
      blsSignature,
      nodePubKey,
      userSignature,
      stakeAmount,
    }),
    [blsPubKey, blsSignature, nodePubKey, userSignature, stakeAmount]
  );

  const {
    registerAndStake,
    resetRegisterAndStake,
    enabled,
    allowanceReadStatus,
    approveWriteStatus,
    addBLSStatus,
    approveErrorMessage,
    addBLSErrorMessage,
  } = useRegisterNode(registerNodeArgs);

  const handleClick = () => {
    if (isRegistrationPausedFlagEnabled) {
      toast.error(<RegistrationPausedInfo />);
    } else {
      if (enabled) {
        resetRegisterAndStake();
        registerAndStake();
      } else {
        registerAndStake();
      }
    }
  };

  const tokenAmount = formatSENTBigInt(stakeAmount);

  return (
    <>
      <Button
        data-testid={ButtonDataTestId.Register_Submit}
        rounded="lg"
        size="lg"
        onClick={handleClick}
        disabled={disabled || addBLSStatus !== PROGRESS_STATUS.IDLE}
      >
        {dictionary('button.submit', { amount: stakeAmountString })}
      </Button>
      {enabled ? (
        <Progress
          steps={[
            {
              text: {
                [PROGRESS_STATUS.IDLE]: dictionaryStage('validate.idle', { tokenAmount }),
                [PROGRESS_STATUS.PENDING]: dictionaryStage('validate.pending', {
                  tokenAmount,
                }),
                [PROGRESS_STATUS.SUCCESS]: dictionaryStage('validate.success', {
                  tokenAmount,
                }),
                [PROGRESS_STATUS.ERROR]: approveErrorMessage,
              },
              status: allowanceReadStatus,
            },
            {
              text: {
                [PROGRESS_STATUS.IDLE]: dictionaryStage('approve.idle', { tokenAmount }),
                [PROGRESS_STATUS.PENDING]: dictionaryStage('approve.pending', {
                  tokenAmount,
                }),
                [PROGRESS_STATUS.SUCCESS]: dictionaryStage('approve.success'),
                [PROGRESS_STATUS.ERROR]: approveErrorMessage,
              },
              status: approveWriteStatus,
            },
            {
              text: {
                [PROGRESS_STATUS.IDLE]: dictionaryStage('arbitrum.idle'),
                [PROGRESS_STATUS.PENDING]: dictionaryStage('arbitrum.pending'),
                [PROGRESS_STATUS.SUCCESS]: dictionaryStage('arbitrum.success'),
                [PROGRESS_STATUS.ERROR]: addBLSErrorMessage,
              },
              status: addBLSStatus,
            },
            {
              text: {
                [PROGRESS_STATUS.IDLE]: dictionaryStage('network.idle'),
                [PROGRESS_STATUS.PENDING]: dictionaryStage('network.pending'),
                [PROGRESS_STATUS.SUCCESS]: dictionaryStage('network.success'),
                [PROGRESS_STATUS.ERROR]: addBLSErrorMessage,
              },
              status:
                addBLSStatus === PROGRESS_STATUS.SUCCESS
                  ? PROGRESS_STATUS.SUCCESS
                  : PROGRESS_STATUS.IDLE,
            },
          ]}
        />
      ) : null}
    </>
  );
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
  const { tokenBalance } = useWallet();
  const { setIsBalanceVisible } = useWalletButton();

  const { enabled: isRegistrationPausedFlagEnabled, isLoading: isRemoteFlagLoading } =
    useRemoteFeatureFlagQuery(REMOTE_FEATURE_FLAG.DISABLE_NODE_REGISTRATION);

  const stakeAmount = BigInt(SESSION_NODE.FULL_STAKE_AMOUNT);
  const stakeAmountString = formatSENTBigInt(stakeAmount);
  const preparationDate = getDateFromUnixTimestampSeconds(node.timestamp);

  const { found, openNode, stakedNode, runningNode, networkTime, blockHeight } = useRegisteredNode({
    nodeId: node.pubkey_ed25519,
  });

  /** While the component is mounted, show the balance */
  useEffect(() => {
    setIsBalanceVisible(true);
    return () => {
      setIsBalanceVisible(false);
    };
  }, [setIsBalanceVisible]);

  return (
    <div className="flex flex-col gap-4">
      {!isRemoteFlagLoading && isRegistrationPausedFlagEnabled ? (
        <span>Registrations are disabled</span>
      ) : null}
      {stakedNode ? (
        <>
          <span className="mb-4 text-lg font-medium">
            {dictionary.rich('notFound.foundRunningNode')}
          </span>
          <StakedNodeCard node={stakedNode} networkTime={networkTime} blockHeight={blockHeight} />
        </>
      ) : runningNode ? (
        <>
          <span className="mb-4 text-lg font-medium">
            {dictionary('notFound.foundRunningNodeOtherOperator')}
          </span>
          <StakedNodeCard
            node={runningNode}
            networkTime={networkTime}
            blockHeight={blockHeight}
            hideButton
          />
        </>
      ) : openNode ? (
        <>
          <span className="mb-4 text-lg font-medium">{dictionary('notFound.foundOpenNode')}</span>
          <NodeStakingForm node={openNode} />
        </>
      ) : null}
      <ActionModuleRow
        label={sessionNodeDictionary('publicKeyShort')}
        tooltip={sessionNodeDictionary('publicKeyDescription')}
      >
        <PubKey pubKey={node.pubkey_ed25519} force="collapse" alwaysShowCopyButton />
      </ActionModuleRow>
      <ActionModuleRow
        label={registerCardDictionary('type')}
        tooltip={registerCardDictionary('typeDescription')}
      >
        {registerCardDictionary(node.type === 'solo' ? 'solo' : 'multi')}
      </ActionModuleRow>
      <ActionModuleRow
        label={dictionary('preparedAtTimestamp')}
        tooltip={dictionary('preparedAtTimestampDescription')}
      >
        <Tooltip
          tooltipContent={formatDate(preparationDate, {
            dateStyle: 'full',
            timeStyle: 'full',
          })}
        >
          <div className="cursor-pointer">
            {formatLocalizedRelativeTimeToNowClient(preparationDate, { addSuffix: true })}
          </div>
        </Tooltip>
      </ActionModuleRow>
      {node.type === 'solo' ? (
        <ActionModuleRow
          label={actionModuleSharedDictionary('stakeAmount')}
          tooltip={actionModuleSharedDictionary('stakeAmountDescription')}
        >
          <span className="inline-flex flex-row items-center gap-1.5 align-middle">
            {tokenBalance && tokenBalance < stakeAmount ? (
              <AlertTooltip
                tooltipContent={dictionary('notEnoughTokensAlert', {
                  walletAmount: formatSENTBigInt(tokenBalance),
                  tokenAmount: stakeAmountString,
                })}
              />
            ) : null}
            {stakeAmountString}
          </span>
        </ActionModuleRow>
      ) : null}
      <RegisterButton
        nodePubKey={node.pubkey_ed25519}
        blsPubKey={node.pubkey_bls}
        blsSignature={node.sig_bls}
        userSignature={node.sig_ed25519}
        stakeAmount={stakeAmount}
        stakeAmountString={stakeAmountString}
        disabled={found || isRegistrationPausedFlagEnabled || isRemoteFlagLoading}
        isRegistrationPausedFlagEnabled={isRegistrationPausedFlagEnabled}
      />
    </div>
  );
}

export function NodeRegistrationFormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <ActionModuleRowSkeleton />
      <ActionModuleRowSkeleton />
      <ActionModuleRowSkeleton />
      <ActionModuleRowSkeleton />
      <ButtonSkeleton rounded="lg" size="lg" />
    </div>
  );
}
