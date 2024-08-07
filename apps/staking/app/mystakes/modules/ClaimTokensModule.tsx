'use client';

import { ButtonModule, ModuleContent, ModuleText } from '@session/ui/components/Module';
import { PresentIcon } from '@session/ui/icons/PresentIcon';
import { useUnclaimedTokens } from '@/app/mystakes/modules/UnclaimedTokensModule';
import { cn } from '@session/ui/lib/utils';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from '@session/ui/ui/alert-dialog';
import { useTranslations } from 'next-intl';
import { ActionModuleRow } from '@/components/ActionModule';
import { Button } from '@session/ui/ui/button';
import { formatBigIntTokenValue } from '@session/util/maths';
import { ETH_DECIMALS } from '@session/wallet/lib/eth';
import { LoadingText } from '@session/ui/components/loading-text';
import { TICKER, URL } from '@/lib/constants';
import useClaimRewards, { CLAIM_REWARDS_STATE } from '@/hooks/useClaimRewards';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { externalLink } from '@/lib/locale-defaults';
import { TriangleAlertIcon } from '@session/ui/icons/TriangleAlertIcon';
import { Tooltip } from '@session/ui/ui/tooltip';
import { useStakingBackendQueryWithParams } from '@/lib/sent-staking-backend-client';
import { getRewardsClaimSignature } from '@/lib/queries/getRewardsClaimSignature';
import type { WriteContractStatus } from '@session/contracts/hooks/useContractWriteQuery';
import type { VariantProps } from 'class-variance-authority';
import { StatusIndicator, statusVariants } from '@session/ui/components/StatusIndicator';

export default function ClaimTokensModule() {
  const [open, setOpen] = useState<boolean>(false);
  const dictionary = useTranslations('modules.claim');
  const { canClaim, unclaimedRewards, formattedUnclaimedRewardsAmount } = useUnclaimedTokens();

  const handleClick = () => {
    if (!canClaim) return;
  };

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogTrigger asChild onClick={handleClick}>
        <ButtonModule
          data-testid={ButtonDataTestId.Claim_Tokens_Open_Dialog}
          className="group items-center transition-all duration-300"
          disabled={!canClaim}
          onClick={handleClick}
        >
          <ModuleContent className="flex h-full select-none flex-row items-center gap-2 p-0 align-middle font-bold">
            <PresentIcon
              className={cn(
                'mb-2 h-8 w-8 transition-all duration-300',
                canClaim
                  ? 'fill-session-green group-hover:fill-session-black'
                  : 'fill-session-text opacity-50'
              )}
            />
            <ModuleText
              className={cn(
                'h-8 text-3xl transition-all duration-300',
                canClaim ? 'text-session-green group-hover:text-black' : 'opacity-50'
              )}
            >
              {dictionary('title')}
            </ModuleText>
          </ModuleContent>
        </ButtonModule>
      </AlertDialogTrigger>
      {canClaim && unclaimedRewards && open ? (
        <ClaimTokensDialog
          canClaim={canClaim}
          unclaimedRewards={unclaimedRewards}
          formattedUnclaimedRewardsAmount={formattedUnclaimedRewardsAmount}
        />
      ) : null}
    </AlertDialog>
  );
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

const stageDictionaryMap: Record<CLAIM_REWARDS_STATE, string> = {
  [CLAIM_REWARDS_STATE.SIMULATE_UPDATE_BALANCE]: 'updateBalance.simulate',
  [CLAIM_REWARDS_STATE.WRITE_UPDATE_BALANCE]: 'updateBalance.write',
  [CLAIM_REWARDS_STATE.TRANSACTION_UPDATE_BALANCE]: 'updateBalance.transaction',
  [CLAIM_REWARDS_STATE.SIMULATE_CLAIM]: 'claimRewards.simulate',
  [CLAIM_REWARDS_STATE.WRITE_CLAIM]: 'claimRewards.write',
  [CLAIM_REWARDS_STATE.TRANSACTION_CLAIM]: 'claimRewards.transaction',
} as const;

function getDictionaryKeyFromStageAndSubStage<
  Stage extends CLAIM_REWARDS_STATE,
  SubStage extends WriteContractStatus,
>({
  currentStage,
  stage,
  subStage,
}: {
  currentStage: CLAIM_REWARDS_STATE;
  stage: Stage;
  subStage: SubStage;
}) {
  return `${stageDictionaryMap[stage]}.${stage > currentStage || subStage === 'idle' ? 'pending' : subStage}`;
}

function StageRow({
  currentStage,
  stage,
  subStage,
  children,
}: {
  currentStage: CLAIM_REWARDS_STATE;
  stage: CLAIM_REWARDS_STATE;
  subStage: WriteContractStatus;
  children?: ReactNode;
}) {
  const dictionary = useTranslations('modules.claim.stage');
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
        {dictionary(
          /** @ts-expect-error - TODO: Properly type this dictionary key construction function */
          children ?? getDictionaryKeyFromStageAndSubStage({ currentStage, stage, subStage })
        )}
      </span>
    </span>
  );
}

function QueryStatusInformation({
  stage,
  subStage,
}: {
  stage: CLAIM_REWARDS_STATE;
  subStage: WriteContractStatus;
}) {
  return (
    <div className="flex w-full flex-col gap-8">
      <StageRow
        stage={CLAIM_REWARDS_STATE.SIMULATE_UPDATE_BALANCE}
        currentStage={stage}
        subStage={subStage}
      />
      <StageRow
        stage={CLAIM_REWARDS_STATE.WRITE_UPDATE_BALANCE}
        currentStage={stage}
        subStage={subStage}
      />
      <StageRow
        stage={CLAIM_REWARDS_STATE.TRANSACTION_UPDATE_BALANCE}
        currentStage={stage}
        subStage={subStage}
      />
      <StageRow
        stage={CLAIM_REWARDS_STATE.SIMULATE_CLAIM}
        currentStage={stage}
        subStage={subStage}
      />
      <StageRow stage={CLAIM_REWARDS_STATE.WRITE_CLAIM} currentStage={stage} subStage={subStage} />
      <StageRow
        stage={CLAIM_REWARDS_STATE.TRANSACTION_CLAIM}
        currentStage={stage}
        subStage={subStage}
      />
      <StageRow
        stage={CLAIM_REWARDS_STATE.TRANSACTION_CLAIM}
        currentStage={stage}
        subStage={subStage}
      >
        {stage === CLAIM_REWARDS_STATE.TRANSACTION_CLAIM && subStage === 'success'
          ? 'done.success'
          : 'done.pending'}
      </StageRow>
    </div>
  );
}

const GasAlertTooltip = ({ tooltipContent }: { tooltipContent: ReactNode }) => {
  return (
    <Tooltip tooltipContent={tooltipContent}>
      <TriangleAlertIcon className="stroke-warning mb-0.5 h-4 w-4" />
    </Tooltip>
  );
};

function ClaimTokensDialog({
  formattedUnclaimedRewardsAmount,
  unclaimedRewards,
  canClaim,
}: Omit<ReturnType<typeof useUnclaimedTokens>, 'refetch' | 'status'>) {
  const [enabled, setEnabled] = useState<boolean>(false);
  const { address } = useWallet();
  const dictionary = useTranslations('modules.claim.dialog');

  const { data: rewardsClaimData, status: rewardsClaimDataStatus } =
    useStakingBackendQueryWithParams(
      getRewardsClaimSignature,
      { address: address! },
      { enabled: !!address }
    );

  const { updateBalanceAndClaimRewards, claimFee, updateBalanceFee, estimateFee, stage, subStage } =
    useClaimRewards({
      address: address,
      rewards: rewardsClaimData ? BigInt(rewardsClaimData.bls_rewards_response.amount) : undefined,
      blsSignature: rewardsClaimData?.bls_rewards_response.signature,
      excludedSigners: rewardsClaimData?.bls_rewards_response.non_signer_indices.map(BigInt),
    });

  const feeEstimate = useMemo(
    () =>
      updateBalanceFee !== null || claimFee !== null
        ? formatBigIntTokenValue(
            (updateBalanceFee ?? BigInt(0)) + (claimFee ?? BigInt(0)),
            ETH_DECIMALS,
            18
          )
        : null,
    [updateBalanceFee, claimFee]
  );

  const handleClick = () => {
    setEnabled(true);
    updateBalanceAndClaimRewards();
  };

  useEffect(() => {
    if (
      address &&
      unclaimedRewards &&
      canClaim &&
      rewardsClaimData &&
      rewardsClaimDataStatus === 'success'
    ) {
      estimateFee();
    }
  }, [address, unclaimedRewards, canClaim, rewardsClaimDataStatus, rewardsClaimData]);

  return (
    <AlertDialogContent title={dictionary('title')}>
      <div className="flex flex-col gap-4">
        <ActionModuleRow
          label={dictionary('claimFee')}
          tooltip={dictionary.rich('claimFeeTooltip', {
            link: externalLink(URL.GAS_INFO),
          })}
        >
          <span className="inline-flex flex-row items-center gap-1.5 align-middle">
            {feeEstimate && !updateBalanceFee ? (
              <GasAlertTooltip tooltipContent={dictionary('alert.gasFetchFailedUpdateBalance')} />
            ) : null}
            {feeEstimate && !claimFee ? (
              <GasAlertTooltip tooltipContent={dictionary('alert.gasFetchFailedClaimRewards')} />
            ) : null}
            {feeEstimate ? `${feeEstimate} ${TICKER.ETH}` : <LoadingText />}
          </span>
        </ActionModuleRow>
        <ActionModuleRow
          label={dictionary('amountClaimable')}
          tooltip={dictionary('amountClaimableTooltip')}
        >
          {formattedUnclaimedRewardsAmount}
        </ActionModuleRow>
      </div>
      <AlertDialogFooter className="mt-4 flex flex-col gap-8 sm:flex-col">
        <Button
          variant="outline"
          rounded="md"
          size="lg"
          aria-label={dictionary('buttons.submitAria', {
            tokenAmount: formattedUnclaimedRewardsAmount,
            gasAmount: feeEstimate ?? 0,
          })}
          className="w-full"
          data-testid={ButtonDataTestId.Claim_Tokens_Submit}
          disabled={!canClaim}
          onClick={handleClick}
        >
          {dictionary('buttons.submit')}
        </Button>
        {enabled ? <QueryStatusInformation stage={stage} subStage={subStage} /> : null}
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
