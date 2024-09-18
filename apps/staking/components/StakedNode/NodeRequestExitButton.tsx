import { ButtonDataTestId } from '@/testing/data-test-ids';
import { useTranslations } from 'next-intl';
import { CollapsableButton, type StakedNode } from '@/components/StakedNodeCard';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from '@session/ui/ui/alert-dialog';
import { Button } from '@session/ui/ui/button';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { formatLocalizedTimeFromSeconds } from '@/lib/locale-client';
import { SESSION_NODE_TIME, SOCIALS, URL } from '@/lib/constants';
import { externalLink } from '@/lib/locale-defaults';
import { useChain } from '@session/contracts/hooks/useChain';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { getTotalStakedAmountForAddress } from '@/components/NodeCard';
import { formatBigIntTokenValue } from '@session/util/maths';
import { ETH_DECIMALS } from '@session/wallet/lib/eth';
import { useRemoteFeatureFlagQuery } from '@/lib/feature-flags-client';
import { REMOTE_FEATURE_FLAG } from '@/lib/feature-flags';
import { Loading } from '@session/ui/components/loading';
import Link from 'next/link';
import { Social } from '@session/ui/components/SocialLinkList';
import { ChevronsDownIcon } from '@session/ui/icons/ChevronsDownIcon';
import { Progress, PROGRESS_STATUS } from '@session/ui/motion/progress';
import useRequestNodeExit from '@/hooks/useRequestNodeExit';
import NodeActionModuleInfo from '@/components/StakedNode/NodeActionModuleInfo';
import { SENT_SYMBOL } from '@session/contracts';

enum EXIT_REQUEST_STATE {
  ALERT,
  PENDING,
}

export function NodeRequestExitButton({ node }: { node: StakedNode }) {
  const [exitRequestState, setExitRequestState] = useState<EXIT_REQUEST_STATE>(
    EXIT_REQUEST_STATE.ALERT
  );
  const dictionary = useTranslations('nodeCard.staked.requestExit');
  const { enabled: isNodeExitRequestDisabled, isLoading: isRemoteFlagLoading } =
    useRemoteFeatureFlagQuery(REMOTE_FEATURE_FLAG.DISABLE_REQUEST_NODE_EXIT);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <CollapsableButton
          ariaLabel={dictionary('buttonAria')}
          dataTestId={ButtonDataTestId.Staked_Node_Request_Exit}
        >
          {dictionary('buttonText')}
        </CollapsableButton>
      </AlertDialogTrigger>
      <AlertDialogContent
        dialogTitle={
          <>
            {exitRequestState !== EXIT_REQUEST_STATE.ALERT ? (
              <ChevronsDownIcon
                className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute left-8 mt-1.5 rotate-90 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
                onClick={() => setExitRequestState(EXIT_REQUEST_STATE.ALERT)}
              />
            ) : null}
            {dictionary('dialog.title')}
          </>
        }
        className="text-center"
      >
        {isRemoteFlagLoading ? (
          <Loading />
        ) : isNodeExitRequestDisabled ? (
          <RequestNodeExitDisabled />
        ) : exitRequestState === EXIT_REQUEST_STATE.PENDING ? (
          <RequestNodeExitContractWriteDialog node={node} />
        ) : (
          <RequestNodeExitDialog
            node={node}
            onSubmit={() => setExitRequestState(EXIT_REQUEST_STATE.PENDING)}
          />
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}

function RequestNodeExitDisabled() {
  const dictionary = useTranslations('nodeCard.staked.requestExit');
  return (
    <p>
      {dictionary.rich('disabledInfo', {
        link: (children: ReactNode) => (
          <Link
            className="text-session-green font-medium underline"
            href={SOCIALS[Social.Discord].link}
            referrerPolicy="no-referrer"
            target="_blank"
          >
            {children}
          </Link>
        ),
      })}
    </p>
  );
}

function RequestNodeExitDialog({ node, onSubmit }: { node: StakedNode; onSubmit: () => void }) {
  const chain = useChain();
  const dictionary = useTranslations('nodeCard.staked.requestExit.dialog');

  return (
    <>
      <div className="text-lg font-medium">{dictionary('description1')}</div>
      <p>
        {dictionary('description2', {
          request_time: formatLocalizedTimeFromSeconds(
            SESSION_NODE_TIME(chain).EXIT_REQUEST_TIME_SECONDS,
            {
              addSuffix: true,
            }
          ),
        })}
        <br />
        <br />
        {dictionary.rich('description3', {
          request_time: formatLocalizedTimeFromSeconds(
            SESSION_NODE_TIME(chain).EXIT_REQUEST_TIME_SECONDS
          ),
          exit_time: formatLocalizedTimeFromSeconds(
            SESSION_NODE_TIME(chain).EXIT_GRACE_TIME_SECONDS
          ),
          link: externalLink(URL.NODE_LIQUIDATION_LEARN_MORE),
        })}
        <br />
        <br />
        {dictionary('description4')}
      </p>
      <AlertDialogFooter className="mt-4 flex w-full flex-col font-medium sm:flex-row">
        <Button
          variant="destructive-ghost"
          rounded="md"
          size="lg"
          aria-label={dictionary('buttons.submitAria', {
            pubKey: node.pubKey,
          })}
          className="w-full"
          data-testid={ButtonDataTestId.Staked_Node_Request_Exit_Dialog_Submit}
          onClick={onSubmit}
          type="submit"
        >
          {dictionary('buttons.submit')}
        </Button>
        <AlertDialogCancel asChild>
          <Button
            variant="ghost"
            rounded="md"
            size="lg"
            className="w-full"
            aria-label={dictionary('buttons.cancelAria')}
            data-testid={ButtonDataTestId.Staked_Node_Request_Exit_Dialog_Cancel}
          >
            {dictionary('buttons.cancel')}
          </Button>
        </AlertDialogCancel>
      </AlertDialogFooter>
    </>
  );
}

function RequestNodeExitContractWriteDialog({ node }: { node: StakedNode }) {
  const stageDictKey = 'nodeCard.staked.requestExit.dialog.stage' as const;
  const dictionary = useTranslations('nodeCard.staked.requestExit.dialog.write');
  const dictionaryStage = useTranslations(stageDictKey);
  const { address } = useWallet();

  const {
    initiateRemoveBLSPublicKey,
    fee,
    estimateContractWriteFee,
    simulateEnabled,
    resetContract,
    status,
    errorMessage,
  } = useRequestNodeExit({
    contractId: node.contract_id,
  });

  const feeEstimate = useMemo(
    () => (fee !== null ? formatBigIntTokenValue(fee ?? BigInt(0), ETH_DECIMALS, 18) : null),
    [fee]
  );

  const stakedAmount = useMemo(
    () =>
      address ? getTotalStakedAmountForAddress(node.contributors, address) : `0 ${SENT_SYMBOL}`,
    [node.contributors, address]
  );

  const handleClick = () => {
    if (simulateEnabled) {
      resetContract();
    }
    initiateRemoveBLSPublicKey();
  };

  const isDisabled = !node.contract_id;

  useEffect(() => {
    if (!isDisabled) {
      estimateContractWriteFee();
    }
  }, [node.contract_id]);

  return (
    <>
      <NodeActionModuleInfo
        node={node}
        feeEstimate={feeEstimate}
        feeEstimateText={dictionary('requestFee')}
      />
      <AlertDialogFooter className="mt-4 flex flex-col gap-8 sm:flex-col">
        <Button
          variant="destructive"
          rounded="md"
          size="lg"
          aria-label={dictionary('buttons.submitAria', {
            tokenAmount: stakedAmount,
            gasAmount: feeEstimate ?? 0,
          })}
          className="w-full"
          data-testid={ButtonDataTestId.Staked_Node_Request_Exit_Write_Dialog_Submit}
          disabled={isDisabled || (simulateEnabled && status !== PROGRESS_STATUS.ERROR)}
          onClick={handleClick}
        >
          {dictionary('buttons.submit')}
        </Button>
        {simulateEnabled ? (
          <Progress
            steps={[
              {
                text: {
                  [PROGRESS_STATUS.IDLE]: dictionaryStage('arbitrum.idle'),
                  [PROGRESS_STATUS.PENDING]: dictionaryStage('arbitrum.pending'),
                  [PROGRESS_STATUS.SUCCESS]: dictionaryStage('arbitrum.success'),
                  [PROGRESS_STATUS.ERROR]: errorMessage,
                },
                status,
              },
              {
                text: {
                  [PROGRESS_STATUS.IDLE]: dictionaryStage('network.idle'),
                  [PROGRESS_STATUS.PENDING]: dictionaryStage('network.pending'),
                  [PROGRESS_STATUS.SUCCESS]: dictionaryStage('network.success'),
                  [PROGRESS_STATUS.ERROR]: errorMessage,
                },
                status:
                  status === PROGRESS_STATUS.SUCCESS
                    ? PROGRESS_STATUS.SUCCESS
                    : PROGRESS_STATUS.IDLE,
              },
            ]}
          />
        ) : null}
      </AlertDialogFooter>
    </>
  );
}
