import { ActionModuleRow } from '@/components/ActionModule';
import { NodeContributorList } from '@/components/NodeCard';
import { PubKey } from '@session/ui/components/PubKey';
import { externalLink } from '@/lib/locale-defaults';
import { TICKER, URL } from '@/lib/constants';
import { LoadingText } from '@session/ui/components/loading-text';
import { useTranslations } from 'next-intl';
import { Stake } from '@session/sent-staking-js/client';
import { formatSENTNumber } from '@session/contracts/hooks/SENT';
import { SENT_SYMBOL } from '@session/contracts';
import { useMemo } from 'react';

export default function NodeActionModuleInfo({
  node,
  feeEstimate,
  feeEstimateText,
}: {
  node: Stake;
  feeEstimate?: string | null;
  feeEstimateText?: string;
}) {
  const dictionary = useTranslations('nodeCard.staked.requestExit.dialog.write');
  const dictionaryActionModulesNode = useTranslations('actionModules.node');
  const sessionNodeDictionary = useTranslations('sessionNodes.general');

  const stakedAmount = useMemo(
    () => (node.staked_balance ? formatSENTNumber(node.staked_balance) : `0 ${SENT_SYMBOL}`),
    [node.staked_balance]
  );

  return (
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
        <PubKey pubKey={node.service_node_pubkey} force="collapse" alwaysShowCopyButton />
      </ActionModuleRow>
      <ActionModuleRow
        label={sessionNodeDictionary('operatorAddress')}
        tooltip={sessionNodeDictionary('operatorAddressTooltip')}
      >
        {node.contributors[0]?.address ? (
          <PubKey pubKey={node.contributors[0]?.address} force="collapse" alwaysShowCopyButton />
        ) : null}
      </ActionModuleRow>
      {typeof feeEstimate !== 'undefined' ? (
        <ActionModuleRow
          label={feeEstimateText ?? dictionaryActionModulesNode('feeEstimate')}
          tooltip={dictionaryActionModulesNode.rich('feeEstimateTooltip', {
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
      ) : null}
      <ActionModuleRow
        label={dictionary('amountStaked')}
        tooltip={dictionary('amountStakedTooltip')}
      >
        {stakedAmount}
      </ActionModuleRow>
    </div>
  );
}
