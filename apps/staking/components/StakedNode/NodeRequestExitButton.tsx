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
import { SESSION_NODE_TIME, SOCIALS, TICKER, TOAST, URL } from '@/lib/constants';
import { ActionModuleRow } from '@/components/ActionModule';
import { externalLink } from '@/lib/locale-defaults';
import { SENT_SYMBOL } from '@session/contracts';
import type {
  GenericContractStatus,
  WriteContractStatus,
} from '@session/contracts/hooks/useContractWriteQuery';
import { StatusIndicator } from '@session/ui/components/StatusIndicator';
import type { SimulateContractErrorType, WriteContractErrorType } from 'viem';
import { toast } from '@session/ui/lib/toast';
import { collapseString } from '@session/util/string';
import { useChain } from '@session/contracts/hooks/useChain';
import { useInitiateRemoveBLSPublicKey } from '@session/contracts/hooks/ServiceNodeRewards';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { getTotalStakedAmountForAddress, NodeContributorList } from '@/components/NodeCard';
import { PubKey } from '@session/ui/components/PubKey';
import { LoadingText } from '@session/ui/components/loading-text';
import { formatBigIntTokenValue } from '@session/util/maths';
import { ETH_DECIMALS } from '@session/wallet/lib/eth';
import { useRemoteFeatureFlagQuery } from '@/lib/feature-flags-client';
import { REMOTE_FEATURE_FLAG } from '@/lib/feature-flags';
import { Loading } from '@session/ui/components/loading';
import Link from 'next/link';
import { Social } from '@session/ui/components/SocialLinkList';
import { ChevronsDownIcon } from '@session/ui/icons/ChevronsDownIcon';

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
  const dictionary = useTranslations('nodeCard.staked.requestExit.dialog.write');
  const dictionaryStage = useTranslations('nodeCard.staked.requestExit.dialog.stage');
  const dictionaryActionModulesNode = useTranslations('actionModules.node');
  const sessionNodeDictionary = useTranslations('sessionNodes.general');
  const { address } = useWallet();

  const {
    initiateRemoveBLSPublicKey,
    fee,
    estimateContractWriteFee,
    simulateStatus,
    writeStatus,
    transactionStatus,
    estimateFeeError,
    simulateError,
    writeError,
    transactionError,
    simulateEnabled,
  } = useInitiateRemoveBLSPublicKey({
    contractId: node.contract_id,
  });

  const feeEstimate = useMemo(
    () => (fee !== null ? formatBigIntTokenValue(fee ?? BigInt(0), ETH_DECIMALS, 18) : null),
    [fee]
  );

  const stakedAmount = useMemo(
    () => (address ? getTotalStakedAmountForAddress(node.contributors, address) : 0),
    [node.contributors, address]
  );

  const handleClick = () => {
    initiateRemoveBLSPublicKey();
  };

  const isDisabled = !node.contract_id;

  const isButtonDisabled = isDisabled || simulateEnabled;

  useEffect(() => {
    if (!isDisabled) {
      estimateContractWriteFee();
    }
  }, [node.contract_id]);

  useEffect(() => {
    if (estimateFeeError) {
      toast.handleError(estimateFeeError);
    }
  }, [simulateError]);

  useEffect(() => {
    if (simulateError) {
      toast.handleError(simulateError);
      toast.error(dictionaryStage('errorTooltip'));
    }
  }, [simulateError]);

  useEffect(() => {
    if (writeError) {
      toast.handleError(writeError);
      toast.error(dictionaryStage('errorTooltip'));
    }
  }, [writeError]);

  useEffect(() => {
    if (transactionError) {
      toast.handleError(transactionError);
      toast.error(dictionaryStage('errorTooltip'));
    }
  }, [transactionError]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <ActionModuleRow
          label={dictionaryActionModulesNode('contributors')}
          tooltip={dictionaryActionModulesNode('contributorsTooltip')}
        >
          <span className="flex flex-row flex-wrap items-center gap-2 align-middle">
            <NodeContributorList contributors={node.contributors} forceExpand showEmptySlots />
          </span>
        </ActionModuleRow>
        <ActionModuleRow
          label={sessionNodeDictionary('publicKeyShort')}
          tooltip={sessionNodeDictionary('publicKeyDescription')}
        >
          <PubKey pubKey={node.pubKey} force="collapse" alwaysShowCopyButton />
        </ActionModuleRow>
        <ActionModuleRow
          label={sessionNodeDictionary('operatorAddress')}
          tooltip={sessionNodeDictionary('operatorAddressTooltip')}
        >
          {node.contributors[0]?.address ? (
            <PubKey pubKey={node.contributors[0]?.address} force="collapse" alwaysShowCopyButton />
          ) : null}
        </ActionModuleRow>
        <ActionModuleRow
          label={dictionary('requestFee')}
          tooltip={dictionary.rich('requestFeeTooltip', {
            link: externalLink(URL.GAS_INFO),
          })}
        >
          <span className="inline-flex flex-row items-center gap-1.5 align-middle">
            {feeEstimate ? (
              `${feeEstimate} ${TICKER.ETH}`
            ) : (
              <LoadingText className="mr-8 scale-x-75 scale-y-50" />
            )}
          </span>
        </ActionModuleRow>
        <ActionModuleRow
          label={dictionary('amountStaked')}
          tooltip={dictionary('amountStakedTooltip')}
        >
          {stakedAmount} {SENT_SYMBOL}
        </ActionModuleRow>
      </div>
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
          disabled={isButtonDisabled}
          onClick={handleClick}
        >
          {dictionary('buttons.submit')}
        </Button>
        {simulateEnabled ? (
          <QueryStatusInformation
            simulateStatus={simulateStatus}
            writeStatus={writeStatus}
            transactionStatus={transactionStatus}
          />
        ) : null}
      </AlertDialogFooter>
    </>
  );
}

const handleError = (error: Error | SimulateContractErrorType | WriteContractErrorType) => {
  console.error(error);
  if (error.message) {
    toast.error(
      collapseString(error.message, TOAST.ERROR_COLLAPSE_LENGTH, TOAST.ERROR_COLLAPSE_LENGTH)
    );
  }
};

enum QUERY_STAGE {
  IDLE,
  PENDING,
  SUCCESS,
  ERROR,
}

function QueryStatusInformation({
  simulateStatus,
  writeStatus,
  transactionStatus,
}: {
  simulateStatus: GenericContractStatus;
  writeStatus: WriteContractStatus;
  transactionStatus: GenericContractStatus;
}) {
  const dictionary = useTranslations('nodeCard.staked.requestExit.dialog.stage');
  const stage = useMemo(() => {
    if (simulateStatus === 'error' || writeStatus === 'error' || transactionStatus === 'error') {
      return QUERY_STAGE.ERROR;
    }

    if (
      simulateStatus === 'success' &&
      writeStatus === 'success' &&
      transactionStatus === 'success'
    ) {
      return QUERY_STAGE.SUCCESS;
    }

    if (
      simulateStatus === 'pending' ||
      writeStatus === 'pending' ||
      transactionStatus === 'pending'
    ) {
      return QUERY_STAGE.PENDING;
    }
    return QUERY_STAGE.IDLE;
  }, [simulateStatus, writeStatus, transactionStatus]);

  return (
    <div className="flex w-full flex-col gap-8">
      <span className="inline-flex items-center gap-4 align-middle">
        <StatusIndicator
          className="h-4 w-4"
          status={
            stage === QUERY_STAGE.SUCCESS
              ? 'green'
              : stage === QUERY_STAGE.PENDING
                ? 'pending'
                : stage === QUERY_STAGE.ERROR
                  ? 'red'
                  : 'grey'
          }
        />
        <span className="mt-0.5">
          {stage === QUERY_STAGE.ERROR ? dictionary('error') : dictionary('submit')}
        </span>
      </span>
    </div>
  );
}
