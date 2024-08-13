'use client';

import { PubKey } from '@/components/PubKey';
import { formatDate, formatLocalizedRelativeTimeToNowClient } from '@/lib/locale-client';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { Loading } from '@session/ui/components/loading';
import { Button, ButtonSkeleton } from '@session/ui/ui/button';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { ActionModuleRow, ActionModuleRowSkeleton } from '@/components/ActionModule';
import { useStakingBackendQueryWithParams } from '@/lib/sent-staking-backend-client';
import type { LoadRegistrationsResponse } from '@session/sent-staking-js/client';
import { getPendingNodes } from '@/lib/queries/getPendingNodes';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { FEATURE_FLAG, useFeatureFlag } from '@/providers/feature-flag-provider';
import { QUERY, SESSION_NODE } from '@/lib/constants';
import { formatBigIntTokenValue } from '@session/util/maths';
import { SENT_DECIMALS, SENT_SYMBOL } from '@session/contracts';
import { getDateFromUnixTimestampSeconds } from '@session/util/date';
import { notFound } from 'next/navigation';
import { generateMockRegistrations } from '@session/sent-staking-js/test';
import useRegisterNode, { REGISTER_STAGE } from '@/hooks/useRegisterNode';
import { StatusIndicator, statusVariants } from '@session/ui/components/StatusIndicator';
import type { VariantProps } from 'class-variance-authority';
import { useQuery } from '@tanstack/react-query';
import { getNode } from '@/lib/queries/getNode';
import { type StakedNode, StakedNodeCard } from '@/components/StakedNodeCard';
import Link from 'next/link';
import { Tooltip } from '@session/ui/ui/tooltip';
import { areHexesEqual } from '@session/util/string';
import { isProduction } from '@/lib/env';
import type { WriteContractStatus } from '@session/contracts/hooks/useContractWriteQuery';
import { toast } from '@session/ui/lib/sonner';
import { RegistrationPausedInfo } from '@/components/RegistrationPausedInfo';

// TODO - remove with feature flag pr
const registrationPaused = true;

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
    {
      enabled: isConnected,
      staleTime: QUERY.STALE_TIME_REGISTRATIONS_PAGE,
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
    return data?.registrations?.find((node) => areHexesEqual(node.pubkey_ed25519, nodeId));
  }, [
    data?.registrations,
    showMockRegistration,
    showOneMockNode,
    showTwoMockNodes,
    showThreeMockNodes,
    showManyMockNodes,
    nodeId,
  ]);

  return isLoading ? <Loading /> : node ? <NodeRegistrationForm node={node} /> : notFound();
}

function getStatusFromSubStage(
  subStage: WriteContractStatus
): VariantProps<typeof statusVariants>['status'] {
  switch (subStage) {
    case 'error':
      return 'red';
    case 'success':
      return 'green';
    case 'pending':
      return 'pending';
    default:
    case 'idle':
      return 'grey';
  }
}

const stageDictionaryMap: Record<REGISTER_STAGE, string> = {
  [REGISTER_STAGE.APPROVE]: 'approve',
  [REGISTER_STAGE.SIMULATE]: 'simulate',
  [REGISTER_STAGE.WRITE]: 'write',
  [REGISTER_STAGE.TRANSACTION]: 'transaction',
  [REGISTER_STAGE.JOIN]: 'join',
} as const;

function getDictionaryKeyFromStageAndSubStage<
  Stage extends REGISTER_STAGE,
  SubStage extends WriteContractStatus,
>({
  currentStage,
  stage,
  subStage,
}: {
  currentStage: REGISTER_STAGE;
  stage: Stage;
  subStage: SubStage;
}) {
  return `${stageDictionaryMap[stage]}.${stage > currentStage || subStage === 'idle' ? 'pending' : subStage}`;
}

function StageRow({
  currentStage,
  stage,
  subStage,
}: {
  currentStage: REGISTER_STAGE;
  stage: REGISTER_STAGE;
  subStage: WriteContractStatus;
}) {
  const dictionary = useTranslations('actionModules.register.stage');
  return (
    <span className="inline-flex items-center gap-4 align-middle">
      <StatusIndicator
        className="h-4 w-4"
        status={
          stage === currentStage
            ? getStatusFromSubStage(subStage)
            : stage > currentStage
              ? 'grey'
              : stage < currentStage
                ? 'green'
                : undefined
        }
      />
      <span className="mt-0.5">
        {/** @ts-expect-error - TODO: Properly type this dictionary key construction function */}
        {dictionary(getDictionaryKeyFromStageAndSubStage({ currentStage, stage, subStage }))}
      </span>
    </span>
  );
}

function QueryStatusInformation({
  nodeId,
  stage,
  subStage,
}: {
  nodeId: string;
  stage: REGISTER_STAGE;
  subStage: WriteContractStatus;
}) {
  const dictionary = useTranslations('actionModules.register');

  const { data: nodeRunning } = useQuery({
    queryKey: ['getNode', nodeId, 'checkRegistration'],
    queryFn: async () => {
      if (!isProduction) {
        console.log('Checking if the node has joined the network');
      }

      const node = await getNode({ address: nodeId });

      if (node && 'state' in node && node.state) {
        return true;
      }
      throw new Error('Node has not joined the network yet');
    },
    // Allows for ~5 minutes of waiting
    retry: 50,
    // Retries every 30/n seconds or 5 seconds, whichever is longer
    retryDelay: (attempt) => (isProduction ? Math.max((30 * 1000) / attempt, 5 * 1000) : 5000),
  });

  return (
    <div className="flex w-full flex-col gap-8">
      <StageRow stage={REGISTER_STAGE.APPROVE} currentStage={stage} subStage={subStage} />
      <StageRow stage={REGISTER_STAGE.SIMULATE} currentStage={stage} subStage={subStage} />
      <StageRow stage={REGISTER_STAGE.WRITE} currentStage={stage} subStage={subStage} />
      <StageRow stage={REGISTER_STAGE.TRANSACTION} currentStage={stage} subStage={subStage} />
      <StageRow
        stage={REGISTER_STAGE.JOIN}
        currentStage={stage}
        subStage={nodeRunning ? 'success' : subStage}
      />
      {nodeRunning ? (
        <span>
          {dictionary.rich('goToMyStakes', {
            link: () => (
              <Link href="/mystakes" prefetch className="text-session-green">
                My Stakes
              </Link>
            ),
          })}
        </span>
      ) : null}
    </div>
  );
}

// TODO - Add ability to set the stake amount when we build multi-contributor support
function RegisterButton({
  blsPubKey,
  blsSignature,
  nodePubKey,
  userSignature,
  stakeAmount,
  stakeAmountString,
  disabled,
}: {
  blsPubKey: string;
  blsSignature: string;
  nodePubKey: string;
  userSignature: string;
  stakeAmount: bigint;
  stakeAmountString: string;
  disabled?: boolean;
}) {
  const dictionary = useTranslations('actionModules.register');
  const { registerAndStake, stage, subStage, enabled } = useRegisterNode({
    blsPubKey,
    blsSignature,
    nodePubKey,
    userSignature,
  });

  const handleClick = () => {
    if (registrationPaused) {
      toast.error(<RegistrationPausedInfo />);
    } else {
      registerAndStake();
    }
  };

  return (
    <>
      <Button
        data-testid={ButtonDataTestId.Register_Submit}
        rounded="lg"
        size="lg"
        onClick={handleClick}
        disabled={disabled}
      >
        {dictionary('button.submit', { amount: stakeAmountString })}
      </Button>
      {enabled && (stage !== REGISTER_STAGE.APPROVE || subStage !== 'idle') ? (
        <QueryStatusInformation nodeId={nodePubKey} stage={stage} subStage={subStage} />
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

  const stakeAmount = BigInt(SESSION_NODE.FULL_STAKE_AMOUNT);
  const stakeAmountString = formatBigIntTokenValue(stakeAmount, SENT_DECIMALS);
  const preparationDate = getDateFromUnixTimestampSeconds(node.timestamp);

  const { data: runningNode, isLoading } = useQuery({
    queryKey: ['getNode', node.pubkey_ed25519],
    queryFn: () => getNode({ address: node.pubkey_ed25519 }),
    enabled: false,
  });

  const nodeAlreadyRunning = useMemo(
    () => Boolean(runningNode && 'state' in runningNode && runningNode.state),
    [isLoading, runningNode]
  );

  return (
    <div className="flex flex-col gap-4">
      {nodeAlreadyRunning ? (
        <>
          <span className="mb-4 text-lg font-medium">
            {dictionary('notFound.foundRunningNode')}
          </span>
          <StakedNodeCard node={runningNode as StakedNode} />
          <br />
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
          {stakeAmountString} {SENT_SYMBOL}
        </ActionModuleRow>
      ) : null}
      <RegisterButton
        nodePubKey={node.pubkey_ed25519}
        blsPubKey={node.pubkey_bls}
        blsSignature={node.sig_bls}
        userSignature={node.sig_ed25519}
        stakeAmount={stakeAmount}
        stakeAmountString={stakeAmountString}
        disabled={nodeAlreadyRunning}
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
