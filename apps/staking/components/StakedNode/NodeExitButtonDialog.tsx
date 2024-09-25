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
import { SOCIALS } from '@/lib/constants';
import { Social } from '@session/ui/components/SocialLinkList';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { formatBigIntTokenValue } from '@session/util/maths';
import { ETH_DECIMALS } from '@session/wallet/lib/eth';
import { Button } from '@session/ui/ui/button';
import { NodeExitButton } from '@/components/StakedNode/NodeExitButton';
import { useStakingBackendQueryWithParams } from '@/lib/sent-staking-backend-client';
import { getNodeExitSignatures } from '@/lib/queries/getNodeExitSignatures';
import NodeActionModuleInfo from '@/components/StakedNode/NodeActionModuleInfo';
import { SENT_SYMBOL } from '@session/contracts';
import { Progress, PROGRESS_STATUS } from '@session/ui/motion/progress';
import useExitNode from '@/hooks/useExitNode';
import { Stake } from '@session/sent-staking-js/client';
import { formatSENTNumber } from '@session/contracts/hooks/SENT';

export function NodeExitButtonDialog({ node }: { node: Stake }) {
  const dictionary = useTranslations('nodeCard.staked.exit');
  const { enabled: isNodeExitDisabled, isLoading: isRemoteFlagLoading } = useRemoteFeatureFlagQuery(
    REMOTE_FEATURE_FLAG.DISABLE_NODE_EXIT
  );

  const { data, status } = useStakingBackendQueryWithParams(getNodeExitSignatures, {
    nodePubKey: node.service_node_pubkey,
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
            blsPubKey={data.result.bls_pubkey}
            timestamp={data.result.timestamp}
            blsSignature={data.result.signature}
            excludedSigners={data.result.non_signer_indices}
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
  node: Stake;
  blsPubKey: string;
  timestamp: number;
  blsSignature: string;
  excludedSigners?: Array<number>;
}) {
  const dictionary = useTranslations('nodeCard.staked.exit.dialog');
  const stageDictKey = 'nodeCard.staked.exit.stage' as const;
  const dictionaryStage = useTranslations(stageDictKey);
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
    simulateEnabled,
    resetContract,
    status,
    errorMessage,
  } = useExitNode(removeBlsPublicKeyWithSignatureArgs);

  const feeEstimate = useMemo(
    () => (fee !== null ? formatBigIntTokenValue(fee ?? BigInt(0), ETH_DECIMALS, 18) : null),
    [fee]
  );

  const stakedAmount = useMemo(
    () => (node.staked_balance ? formatSENTNumber(node.staked_balance) : `0 ${SENT_SYMBOL}`),
    [node.staked_balance]
  );

  const handleClick = () => {
    if (simulateEnabled) {
      resetContract();
    }
    removeBLSPublicKeyWithSignature();
  };

  const isDisabled = !blsPubKey || !timestamp || !blsSignature;

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
          data-testid={ButtonDataTestId.Staked_Node_Exit_Dialog_Submit}
          disabled={isDisabled || simulateEnabled}
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
