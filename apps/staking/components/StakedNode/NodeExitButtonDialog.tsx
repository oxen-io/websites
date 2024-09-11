import { type StakedNode } from '@/components/StakedNodeCard';
import { useTranslations } from 'next-intl';
import { useRemoteFeatureFlagQuery } from '@/lib/feature-flags-client';
import { REMOTE_FEATURE_FLAG } from '@/lib/feature-flags';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from '@session/ui/ui/alert-dialog';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { Loading } from '@session/ui/components/loading';
import { type ReactNode, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { SOCIALS, TICKER, TOAST, URL } from '@/lib/constants';
import { Social } from '@session/ui/components/SocialLinkList';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { useRemoveBLSPublicKeyWithSignature } from '@session/contracts/hooks/ServiceNodeRewards';
import { formatBigIntTokenValue } from '@session/util/maths';
import { ETH_DECIMALS } from '@session/wallet/lib/eth';
import { getTotalStakedAmountForAddress, NodeContributorList } from '@/components/NodeCard';
import { toast } from '@session/ui/lib/sonner';
import { ActionModuleRow } from '@/components/ActionModule';
import { PubKey } from '@session/ui/components/PubKey';
import { externalLink } from '@/lib/locale-defaults';
import { LoadingText } from '@session/ui/components/loading-text';
import { SENT_SYMBOL } from '@session/contracts';
import { Button } from '@session/ui/ui/button';
import type { SimulateContractErrorType, WriteContractErrorType } from 'viem';
import { collapseString } from '@session/util/string';
import type {
  GenericContractStatus,
  WriteContractStatus,
} from '@session/contracts/hooks/useContractWriteQuery';
import { StatusIndicator } from '@session/ui/components/StatusIndicator';
import { NodeExitButton } from '@/components/StakedNode/NodeExitButton';
import { useStakingBackendQueryWithParams } from '@/lib/sent-staking-backend-client';
import { getNodeExitSignatures } from '@/lib/queries/getNodeExitSignatures';

export function NodeExitButtonDialog({ node }: { node: StakedNode }) {
  const dictionary = useTranslations('nodeCard.staked.exit');
  const { enabled: isNodeExitDisabled, isLoading: isRemoteFlagLoading } = useRemoteFeatureFlagQuery(
    REMOTE_FEATURE_FLAG.DISABLE_NODE_EXIT
  );

  const { data, status } = useStakingBackendQueryWithParams(getNodeExitSignatures, {
    nodePubKey: node.pubKey,
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <NodeExitButton />
      </AlertDialogTrigger>
      <AlertDialogContent dialogTitle={dictionary('dialog.title')} className="text-center">
        {isRemoteFlagLoading || !data || status !== 'success' ? (
          <Loading />
        ) : isNodeExitDisabled ? (
          <NodeExitDisabled />
        ) : (
          <NodeExitContractWriteDialog
            node={node}
            blsPubKey={data.bls_exit_response.bls_pubkey}
            timestamp={data.bls_exit_response.timestamp}
            blsSignature={data.bls_exit_response.signature}
            excludedSigners={data.bls_exit_response.non_signer_indices}
          />
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}

function NodeExitDisabled() {
  const dictionary = useTranslations('nodeCard.staked.exit');
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

function NodeExitContractWriteDialog({
  node,
  blsPubKey,
  timestamp,
  blsSignature,
  excludedSigners,
}: {
  node: StakedNode;
  blsPubKey: string;
  timestamp: number;
  blsSignature: string;
  excludedSigners?: Array<number>;
}) {
  const dictionary = useTranslations('nodeCard.staked.exit.dialog');
  const dictionaryStage = useTranslations('nodeCard.staked.exit.stage');
  const dictionaryActionModulesNode = useTranslations('actionModules.node');
  const sessionNodeDictionary = useTranslations('sessionNodes.general');
  const { address } = useWallet();

  const removeBlsPublicKeyWithSignatureArgs = useMemo(
    () => ({
      blsPubKey,
      timestamp,
      blsSignature,
      excludedSigners: excludedSigners?.map(BigInt),
    }),
    [blsPubKey, timestamp, blsSignature, excludedSigners]
  );

  const {
    removeBLSPublicKeyWithSignature,
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
  } = useRemoveBLSPublicKeyWithSignature(removeBlsPublicKeyWithSignatureArgs);

  const feeEstimate = useMemo(
    () => (fee !== null ? formatBigIntTokenValue(fee ?? BigInt(0), ETH_DECIMALS, 18) : null),
    [fee]
  );

  const stakedAmount = useMemo(
    () => (address ? getTotalStakedAmountForAddress(node.contributors, address) : 0),
    [node.contributors, address]
  );

  const handleClick = () => {
    removeBLSPublicKeyWithSignature();
  };

  const isDisabled = !blsPubKey || !timestamp || !blsSignature;

  const isButtonDisabled = isDisabled || simulateEnabled;

  useEffect(() => {
    if (!isDisabled) {
      estimateContractWriteFee();
    }
  }, [node.contract_id]);

  useEffect(() => {
    if (estimateFeeError) {
      handleError(estimateFeeError);
    }
  }, [simulateError]);

  useEffect(() => {
    if (simulateError) {
      handleError(simulateError);
      toast.error(dictionaryStage('errorTooltip'));
    }
  }, [simulateError]);

  useEffect(() => {
    if (writeError) {
      handleError(writeError);
      toast.error(dictionaryStage('errorTooltip'));
    }
  }, [writeError]);

  useEffect(() => {
    if (transactionError) {
      handleError(transactionError);
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
          data-testid={ButtonDataTestId.Staked_Node_Exit_Dialog_Submit}
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
  const dictionary = useTranslations('nodeCard.staked.exit.stage');
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
