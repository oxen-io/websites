'use client';

import {
  formatDate,
  formatLocalizedTimeFromSeconds,
  formatNumber,
  formatPercentage,
} from '@/lib/locale-client';
import {
  ButtonDataTestId,
  NodeCardDataTestId,
  StakedNodeDataTestId,
} from '@/testing/data-test-ids';
import { NODE_STATE, Stake } from '@session/sent-staking-js/client';
import { StatusIndicator, statusVariants } from '@session/ui/components/StatusIndicator';
import { ArrowDownIcon } from '@session/ui/icons/ArrowDownIcon';
import { SpannerAndScrewdriverIcon } from '@session/ui/icons/SpannerAndScrewdriverIcon';
import { cn } from '@session/ui/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import { forwardRef, type HTMLAttributes, ReactNode, useMemo, useState } from 'react';
import { NodeCard, NodeCardText, NodeCardTitle, NodeContributorList } from './NodeCard';
import { PubKey } from '@session/ui/components/PubKey';
import { areHexesEqual } from '@session/util/string';
import { Button } from '@session/ui/ui/button';
import { NodeRequestExitButton } from '@/components/StakedNode/NodeRequestExitButton';
import { Tooltip } from '@session/ui/ui/tooltip';
import { SESSION_NODE, SESSION_NODE_TIME, SESSION_NODE_TIME_STATIC, URL } from '@/lib/constants';
import { useChain } from '@session/contracts/hooks/useChain';
import { NodeExitButton } from '@/components/StakedNode/NodeExitButton';
import { NodeExitButtonDialog } from '@/components/StakedNode/NodeExitButtonDialog';
import { externalLink } from '@/lib/locale-defaults';
import { TextSeparator } from '@session/ui/components/Separator';
import useRelativeTime from '@/hooks/useRelativeTime';
import { getDateFromUnixTimestampSeconds } from '@session/util/date';
import { FEATURE_FLAG } from '@/lib/feature-flags';
import { useFeatureFlag } from '@/lib/feature-flags-client';
import { formatSENTNumber } from '@session/contracts/hooks/SENT';
import { ActionModuleDivider } from '@/components/ActionModule';
import { Address } from 'viem';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';

type StakeInContract = Stake & {
  contract_id: NonNullable<Stake['contract_id']>;
  staked_balance: NonNullable<Stake['staked_balance']>;
};

/** The stake is awaiting contributors. */
type AwaitingContributorsNode = Stake & {
  state: NODE_STATE.AWAITING_CONTRIBUTORS;
  last_uptime_proof: null;
};

/** The stake has been cancelled. */
type CancelledNode = AwaitingContributorsNode & { state: NODE_STATE.CANCELLED };

/** The stake is a running node. */
type RunningNode = StakeInContract & {
  state: NODE_STATE.RUNNING;
  last_uptime_proof: NonNullable<Stake['last_uptime_proof']>;
};

/** The stake has been decommissioned. */
type DecommissionedNode = StakeInContract & {
  state: NODE_STATE.DECOMMISSIONED;
};

/** The stake has been deregistered. */
type DeregisteredNode = Stake & {
  state: NODE_STATE.DEREGISTERED;
  deregistration_unlock_height: NonNullable<Stake['deregistration_unlock_height']>;
  liquidation_height: NonNullable<Stake['liquidation_height']>;
};

/** The stake has been requested to exit the smart contract.*/
type NodeRequestingExit = (RunningNode | DecommissionedNode) & {
  requested_unlock_height: NonNullable<Stake['requested_unlock_height']>;
  liquidation_height: NonNullable<Stake['liquidation_height']>;
};

/** The stake is awaiting liquidation. */
type AwaitingExitNode = NodeRequestingExit & {
  state: NODE_STATE.AWAITING_EXIT;
  liquidation_height: NonNullable<Stake['liquidation_height']>;
};

/** The stake has exited the smart contract gracefully. */
type ExitedNode = NodeRequestingExit & {
  state: NODE_STATE.EXITED;
  exited: true;
};

/**
 * Checks if a node is being deregistered.
 * @param node - The node to check.
 * @returns `true` if the node is being deregistered, `false` otherwise.
 */
const isBeingDeregistered = (node: Stake): node is DecommissionedNode =>
  node.state === NODE_STATE.DECOMMISSIONED;

const hasDeregistrationUnlockHeight = (node: Stake): node is DeregisteredNode =>
  !!('deregistration_unlock_height' in node && node.deregistration_unlock_height);

const hasRequestedUnlockHeight = (node: Stake): node is NodeRequestingExit =>
  !!('requested_unlock_height' in node && node.requested_unlock_height);

/**
 * Checks if a given stake has exited the smart contract.
 * @see {@link ExitedNode}
 * @see {@link DeregisteredNode}
 * @param stake - The stake to check.
 */
const hasExited = (stake: Stake): stake is ExitedNode =>
  stake.exited || ('contract_id' in stake && stake.contract_id === null);

/**
 * Checks if a given stake is requesting to exit the smart contract.
 * @see {@link NodeRequestingExit}
 * @param stake - The stake to check.
 * @param blockHeight - The current block height.
 */
const isRequestingToExit = (stake: Stake, blockHeight: number): stake is NodeRequestingExit =>
  !hasExited(stake) &&
  hasRequestedUnlockHeight(stake) &&
  stake.requested_unlock_height >= blockHeight;

/**
 * Checks if a given stake is ready to exit the smart contract.
 * @see {@link NodeRequestingExit}
 * @param stake - The stake to check.
 * @param blockHeight - The current block height.
 */
const isReadyToExit = (stake: Stake, blockHeight: number): stake is NodeRequestingExit =>
  !hasExited(stake) &&
  ((hasRequestedUnlockHeight(stake) && stake.requested_unlock_height <= blockHeight) ||
    (hasDeregistrationUnlockHeight(stake) && stake.deregistration_unlock_height <= blockHeight));

// const isNodePastLiquidationBlock = (node: Stake, blockHeight: number): boolean =>
//   !!(
//     'liquidation_height' in node &&
//     node.liquidation_height &&
//     node.liquidation_height <= blockHeight
//   );

/**
 * Checks if a given node is operated by a specific user.
 * @param node - The session node to check.
 * @param address - The address of the user to compare with.
 * @returns `true` if the node is operated by the specified user, `false` otherwise.
 */
const isNodeOperator = (node: Stake, address: string): boolean =>
  areHexesEqual(node.operator_address, address);

/**
 * Checks if a given contributor address is a contributor of a session node.
 *
 * @param node - The session node to check.
 * @param contributorAddress - The address of the contributor to check.
 * @returns `true` if the contributor address is a contributor of the session node, `false` otherwise.
 */
// const isNodeContributor = (node: StakedNode, contributorAddress: string): boolean =>
//   node.contributors.some(({ address }) => areHexesEqual(address, contributorAddress));

function getNodeStatus(state: NODE_STATE): VariantProps<typeof statusVariants>['status'] {
  switch (state) {
    case NODE_STATE.RUNNING:
      return 'green';
    case NODE_STATE.AWAITING_CONTRIBUTORS:
      return 'blue';
    case NODE_STATE.DECOMMISSIONED:
      return 'yellow';
    case NODE_STATE.CANCELLED:
    case NODE_STATE.DEREGISTERED:
      return 'red';
    case NODE_STATE.EXITED:
    default:
      return 'grey';
  }
}

const blocksInMs = (blocks: number) => blocks * SESSION_NODE.MS_PER_BLOCK;
const msInBlocks = (ms: number) => Math.floor(ms / SESSION_NODE.MS_PER_BLOCK);

class BlockTimeManager {
  private readonly networkTime: number;
  private readonly currentBlock: number;

  constructor(networkTime: number, currentBlock: number) {
    this.networkTime = networkTime;
    this.currentBlock = currentBlock;
  }

  getDateOfBlock(targetBlock: number) {
    return new Date(this.networkTime * 1000 + blocksInMs(targetBlock - this.currentBlock));
  }
}

type ToggleCardExpansionButtonProps = HTMLAttributes<HTMLLabelElement> & {
  htmlFor: string;
};

const ToggleCardExpansionButton = forwardRef<HTMLLabelElement, ToggleCardExpansionButtonProps>(
  ({ className, ...props }, ref) => {
    const [expanded, setExpanded] = useState(false);
    const dictionary = useTranslations('nodeCard.staked');
    return (
      <label
        ref={ref}
        role="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-label={expanded ? dictionary(`ariaCollapse`) : dictionary(`ariaExpand`)}
        data-testid={
          expanded ? StakedNodeDataTestId.Collapse_Button : StakedNodeDataTestId.Expand_Button
        }
        className={cn(
          'ml-auto flex w-max cursor-pointer select-none items-center align-middle peer-checked:[&>svg]:rotate-180',
          className
        )}
        {...props}
      >
        <span className="text-gradient-white hidden font-medium lg:inline-block">
          {expanded ? dictionary('labelCollapse') : dictionary('labelExpand')}
        </span>
        <ArrowDownIcon
          className={cn(
            'fill-session-text stroke-session-text ml-1 h-4 w-4 transform transition-all duration-300 ease-in-out motion-reduce:transition-none'
          )}
        />
      </label>
    );
  }
);

type NodeNotificationProps = HTMLAttributes<HTMLSpanElement> & {
  level?: 'info' | 'warning' | 'error';
};

const NodeNotification = forwardRef<HTMLSpanElement, NodeNotificationProps>(
  ({ className, children, level, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'flex w-3/4 flex-row gap-2 text-xs font-normal sm:w-max md:text-base',
        level === 'warning'
          ? 'text-warning'
          : level === 'error'
            ? 'text-destructive'
            : 'text-session-text',
        className
      )}
      {...props}
    >
      <span>•</span>
      {children}
    </span>
  )
);

const NodeOperatorIndicator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const dictionary = useTranslations('nodeCard.staked');

    return (
      <>
        <Tooltip tooltipContent={dictionary('operatorTooltip')}>
          <div
            ref={ref}
            className={cn(
              'text-session-green flex flex-row items-center gap-1 align-middle text-sm font-normal md:text-base',
              className
            )}
            {...props}
          >
            <SpannerAndScrewdriverIcon className="fill-session-green mb-1 h-3.5 w-3.5" />
            {dictionary('operator')}
          </div>
        </Tooltip>
      </>
    );
  }
);

/**
 * Checks if a given date is in the past or `soon`
 * @see {@link SESSION_NODE_TIME_STATIC.SOON_TIME}
 * @param date - The date to check.
 * @returns `true` if the date is in the past or `soon`, `false` otherwise.
 */
const isDateSoonOrPast = (date: Date | null): boolean =>
  !!(date && Date.now() > date.getTime() - SESSION_NODE_TIME_STATIC.SOON_TIME);

const ReadyForExitNotification = ({
  date,
  timeString,
  className,
}: {
  date: Date | null;
  timeString: string | null;
  className?: string;
}) => {
  const dictionary = useTranslations('nodeCard.staked');
  const dictionaryGeneral = useTranslations('general');
  const notFoundString = dictionaryGeneral('notFound');
  const soonString = dictionaryGeneral('soon');

  const isLiquidationSoon = useMemo(() => isDateSoonOrPast(date), [date]);
  const relativeTime = useMemo(
    () => (!isLiquidationSoon ? timeString : soonString) ?? notFoundString,
    [isLiquidationSoon, timeString, soonString, notFoundString]
  );

  return (
    <Tooltip
      tooltipContent={dictionary.rich('exitTimerDescription', {
        relativeTime,
        link: externalLink(URL.NODE_LIQUIDATION_LEARN_MORE),
      })}
    >
      <NodeNotification level={isLiquidationSoon ? 'error' : 'warning'} className={className}>
        {isLiquidationSoon
          ? dictionary('exitTimerNotificationNow')
          : dictionary('exitTimerNotification', { relativeTime })}
      </NodeNotification>
    </Tooltip>
  );
};

const ExitUnlockTimerNotification = ({
  date,
  timeString,
  className,
}: {
  date: Date | null;
  timeString: string | null;
  className?: string;
}) => {
  const dictionary = useTranslations('nodeCard.staked');
  const dictionaryGeneral = useTranslations('general');
  const notFoundString = dictionaryGeneral('notFound');
  const soonString = dictionaryGeneral('soon');

  const isExitableSoon = useMemo(() => isDateSoonOrPast(date), [date]);
  const relativeTime = useMemo(
    () => (!isExitableSoon ? timeString : soonString) ?? notFoundString,
    [isExitableSoon, timeString, soonString, notFoundString]
  );

  return (
    <Tooltip
      tooltipContent={dictionary('exitUnlockTimerDescription', {
        relativeTime,
        date: date ? formatDate(date, { dateStyle: 'full', timeStyle: 'short' }) : notFoundString,
      })}
    >
      <NodeNotification level="warning" className={className}>
        {dictionary('exitUnlockTimerNotification', { relativeTime })}
      </NodeNotification>
    </Tooltip>
  );
};

const DeregisteringNotification = ({
  date,
  timeString,
}: {
  date: Date | null;
  timeString: string | null;
}) => {
  const chain = useChain();
  const dictionary = useTranslations('nodeCard.staked');
  const generalDictionary = useTranslations('general');
  const notFoundString = generalDictionary('notFound');
  const soonString = generalDictionary('soon');

  const isDeregistrationSoon = isDateSoonOrPast(date);
  const relativeTime = (!isDeregistrationSoon ? timeString : soonString) ?? notFoundString;

  return (
    <Tooltip
      tooltipContent={dictionary('deregistrationTimerDescription', {
        lockedStakeTime: formatLocalizedTimeFromSeconds(
          SESSION_NODE_TIME(chain).DEREGISTRATION_LOCKED_STAKE_SECONDS,
          { unit: 'day' }
        ),
        relativeTime,
        date: date ? formatDate(date, { dateStyle: 'full', timeStyle: 'short' }) : notFoundString,
      })}
    >
      <NodeNotification level="error">
        {dictionary('deregistrationTimerNotification', { relativeTime })}
      </NodeNotification>
    </Tooltip>
  );
};

const NodeSummary = ({
  node,
  blockHeight,
  deregistrationDate,
  deregistrationTime,
  requestedUnlockDate,
  requestedUnlockTime,
  deregistrationUnlockDate,
  deregistrationUnlockTime,
  liquidationDate,
  liquidationTime,
  showAllTimers,
}: {
  node: Stake;
  blockHeight: number;
  deregistrationDate: Date | null;
  deregistrationTime: string | null;
  requestedUnlockDate: Date | null;
  requestedUnlockTime: string | null;
  deregistrationUnlockDate: Date | null;
  deregistrationUnlockTime: string | null;
  liquidationDate: Date | null;
  liquidationTime: string | null;
  showAllTimers?: boolean;
}) => {
  const allTimers = [];
  if (isReadyToExit(node, blockHeight)) {
    const readyToExitTimer = (
      <>
        <NodeContributorList
          contributors={node.contributors}
          data-testid={StakedNodeDataTestId.Contributor_List}
        />
        <ReadyForExitNotification date={liquidationDate} timeString={liquidationTime} />
      </>
    );

    if (showAllTimers) {
      allTimers.push(readyToExitTimer);
    } else {
      return readyToExitTimer;
    }
  }

  if (hasDeregistrationUnlockHeight(node)) {
    const deregisteringTimer = (
      <>
        <NodeContributorList
          contributors={node.contributors}
          data-testid={StakedNodeDataTestId.Contributor_List}
        />
        <ExitUnlockTimerNotification
          date={deregistrationUnlockDate}
          timeString={deregistrationUnlockTime}
        />
      </>
    );

    if (showAllTimers) {
      allTimers.push(deregisteringTimer);
    } else {
      return deregisteringTimer;
    }
  }

  if (isBeingDeregistered(node)) {
    const beingDeregisteredTimers = (
      <DeregisteringNotification date={deregistrationDate} timeString={deregistrationTime} />
    );

    if (showAllTimers) {
      allTimers.push(beingDeregisteredTimers);
    } else {
      return beingDeregisteredTimers;
    }
  }

  if (isRequestingToExit(node, blockHeight)) {
    const requestingExitTimer = (
      <>
        <NodeContributorList
          contributors={node.contributors}
          data-testid={StakedNodeDataTestId.Contributor_List}
        />
        {
          <ExitUnlockTimerNotification
            date={requestedUnlockDate}
            timeString={requestedUnlockTime}
          />
        }
      </>
    );

    if (showAllTimers) {
      allTimers.push(requestingExitTimer);
    } else {
      return requestingExitTimer;
    }
  }

  if (
    (node.state === NODE_STATE.AWAITING_CONTRIBUTORS || node.state === NODE_STATE.RUNNING) &&
    !showAllTimers
  ) {
    return (
      <NodeContributorList
        contributors={node.contributors}
        showEmptySlots={node.state === NODE_STATE.AWAITING_CONTRIBUTORS}
        data-testid={StakedNodeDataTestId.Contributor_List}
      />
    );
  }

  if (showAllTimers) {
    return allTimers;
  } else {
    return null;
  }
};

const collapsableContentVariants = cva(
  'h-full max-h-0 select-none gap-1 overflow-y-hidden transition-all duration-300 ease-in-out peer-checked:select-auto motion-reduce:transition-none',
  {
    variants: {
      size: {
        xs: 'text-xs md:text-xs peer-checked:max-h-4',
        base: cn('text-sm peer-checked:max-h-5', 'md:text-base md:peer-checked:max-h-6'),
        buttonMd: cn('peer-checked:max-h-10'),
      },
      width: {
        'w-full': 'w-full',
        'w-max': 'w-max',
      },
    },
    defaultVariants: {
      size: 'base',
      width: 'w-full',
    },
  }
);

type CollapsableContentProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof collapsableContentVariants>;

export const CollapsableContent = forwardRef<HTMLSpanElement, CollapsableContentProps>(
  ({ className, size, width, ...props }, ref) => (
    <NodeCardText
      ref={ref}
      className={cn(collapsableContentVariants({ size, width, className }))}
      {...props}
    />
  )
);

const RowLabel = ({ children }: { children: ReactNode }) => (
  <span className="font-semibold">{children} </span>
);

export const CollapsableButton = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement> & {
    ariaLabel: string;
    dataTestId: ButtonDataTestId;
    disabled?: boolean;
    mobileChildren?: ReactNode;
  }
>(({ ariaLabel, dataTestId, disabled, children, ...props }, ref) => (
  <CollapsableContent
    className="bottom-4 right-6 flex w-max items-end min-[500px]:absolute"
    size="buttonMd"
  >
    <Button
      data-testid={dataTestId}
      aria-label={ariaLabel}
      disabled={disabled}
      rounded="md"
      size="md"
      variant="destructive-outline"
      className="uppercase"
      ref={ref}
      {...props}
    >
      {children}
    </Button>
  </CollapsableContent>
));

const useNodeDates = (node: Stake, currentBlock: number, networkTime: number) => {
  const blockTime = new BlockTimeManager(networkTime, currentBlock);
  const {
    last_reward_block_height: lastRewardBlock,
    last_uptime_proof: lastUptimeProofSeconds,
    earned_downtime_blocks: earnedDowntimeBlocks,
    requested_unlock_height: requestedUnlockBlock,
    deregistration_unlock_height: deregistrationUnlockBlock,
    liquidation_height: liquidationBlock,
  } = node;

  return useMemo(() => {
    const lastUptimeDate = lastUptimeProofSeconds
      ? getDateFromUnixTimestampSeconds(lastUptimeProofSeconds)
      : null;
    const deregistrationDate = earnedDowntimeBlocks
      ? blockTime.getDateOfBlock(currentBlock + earnedDowntimeBlocks)
      : null;
    const lastRewardDate = lastRewardBlock ? blockTime.getDateOfBlock(lastRewardBlock) : null;
    const requestedUnlockDate = requestedUnlockBlock
      ? blockTime.getDateOfBlock(requestedUnlockBlock)
      : null;
    const deregistrationUnlockDate = deregistrationUnlockBlock
      ? blockTime.getDateOfBlock(deregistrationUnlockBlock)
      : null;
    const liquidationDate = liquidationBlock ? blockTime.getDateOfBlock(liquidationBlock) : null;
    return {
      lastUptimeDate,
      deregistrationDate,
      lastRewardDate,
      requestedUnlockDate,
      deregistrationUnlockDate,
      liquidationDate,
    };
  }, [
    blockTime,
    networkTime,
    currentBlock,
    earnedDowntimeBlocks,
    lastUptimeProofSeconds,
    lastRewardBlock,
    requestedUnlockBlock,
    deregistrationUnlockBlock,
    liquidationBlock,
  ]);
};

/**
 * Generates a unique identifier for a stake. This is used to identify the stake in the UI for the
 * list key and for creating a collapse toggle key.
 * @param stake - The stake to generate an identifier for.
 *
 * @note `contract_id` is a unique identifier for the stake in the smart contract.
 * @note stakes that have exited the smart contract will have a null contract_id.
 * @note stakes can have the same `service_node_pubkey` if they are for the same node. A node can be
 * staked to, exited, then re-staked.
 * @note `last_uptime_proof` is in no way unique. But it's impossible for a stake with the same
 * `service_node_pubkey` to have the same `last_uptime_proof`, as by definition the two stakes are
 * for the same node and can't exist in the same time.
 *
 * @returns A unique identifier for the stake.
 */
export const generateStakeId = (stake: Stake) =>
  `stake-${stake.contract_id}-${stake.service_node_pubkey}-${stake.last_uptime_proof}`;

const StakedNodeCard = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    node: Stake;
    targetWalletAddress?: Address;
    blockHeight: number;
    networkTime: number;
    uniqueId?: string;
    hideButton?: boolean;
  }
>(
  (
    {
      className,
      node,
      blockHeight,
      networkTime,
      hideButton,
      uniqueId,
      targetWalletAddress,
      ...props
    },
    ref
  ) => {
    const dictionary = useTranslations('nodeCard.staked');
    const generalDictionary = useTranslations('general');
    const generalNodeDictionary = useTranslations('sessionNodes.general');
    const stakingNodeDictionary = useTranslations('sessionNodes.staking');
    const titleFormat = useTranslations('modules.title');
    const notFoundString = generalDictionary('notFound');

    const { address: connectedAddress } = useWallet();

    const walletAddress = useMemo(
      () => targetWalletAddress ?? connectedAddress,
      [targetWalletAddress, connectedAddress]
    );

    const toggleId = useMemo(() => `toggle-${uniqueId ?? generateStakeId(node)}`, [uniqueId, node]);

    const {
      state,
      service_node_pubkey: pubKey,
      operator_fee: operatorFee,
      operator_address: operatorAddress,
      contributors,
      staked_balance: stakedBalance,
      last_reward_block_height: lastRewardBlock,
      last_uptime_proof: lastUptimeProofSeconds,
    } = node;

    const formattedStakeBalance = useMemo(() => formatSENTNumber(stakedBalance), [stakedBalance]);
    const showAllTimers = useFeatureFlag(FEATURE_FLAG.SHOW_ALL_TIMERS);
    const showRawNodeData = useFeatureFlag(FEATURE_FLAG.SHOW_NODE_RAW_DATA);

    const {
      lastUptimeDate,
      deregistrationDate,
      lastRewardDate,
      requestedUnlockDate,
      deregistrationUnlockDate,
      liquidationDate,
    } = useNodeDates(node, blockHeight, networkTime);

    const lastRewardTime = useRelativeTime(lastRewardDate, { addSuffix: true });
    const deregistrationTime = useRelativeTime(deregistrationDate, { addSuffix: true });
    const lastUptimeTime = useRelativeTime(lastUptimeDate, { addSuffix: true });
    const requestedUnlockTime = useRelativeTime(requestedUnlockDate, { addSuffix: true });
    const deregistrationUnlockTime = useRelativeTime(deregistrationUnlockDate, { addSuffix: true });
    const liquidationTime = useRelativeTime(liquidationDate, { addSuffix: true });

    const isSoloNode = contributors.length === 1;

    return (
      <NodeCard
        ref={ref}
        {...props}
        className={cn(
          'relative flex flex-row flex-wrap items-center gap-x-2 gap-y-0.5 overflow-hidden pb-4 align-middle',
          className
        )}
        data-testid={NodeCardDataTestId.Staked_Node}
      >
        <input id={toggleId} type="checkbox" className="peer hidden appearance-none" />
        <StatusIndicator
          status={getNodeStatus(state)}
          className="mb-1"
          data-testid={StakedNodeDataTestId.Indicator}
        />
        <NodeCardTitle data-testid={StakedNodeDataTestId.Title}>{state}</NodeCardTitle>
        <NodeSummary
          node={node}
          blockHeight={blockHeight}
          deregistrationDate={deregistrationDate}
          deregistrationTime={deregistrationTime}
          deregistrationUnlockDate={deregistrationUnlockDate}
          deregistrationUnlockTime={deregistrationUnlockTime}
          liquidationDate={liquidationDate}
          liquidationTime={liquidationTime}
          requestedUnlockTime={requestedUnlockTime}
          requestedUnlockDate={requestedUnlockDate}
        />
        <ToggleCardExpansionButton htmlFor={toggleId} />
        {showAllTimers ? (
          <CollapsableContent size="xs">
            <NodeSummary
              node={node}
              blockHeight={blockHeight}
              deregistrationDate={deregistrationDate}
              deregistrationTime={deregistrationTime}
              deregistrationUnlockDate={deregistrationUnlockDate}
              deregistrationUnlockTime={deregistrationUnlockTime}
              liquidationDate={liquidationDate}
              liquidationTime={liquidationTime}
              requestedUnlockTime={requestedUnlockTime}
              requestedUnlockDate={requestedUnlockDate}
              showAllTimers={showAllTimers}
            />
          </CollapsableContent>
        ) : null}
        {isBeingDeregistered(node) && isRequestingToExit(node, blockHeight) ? (
          <CollapsableContent className="text-warning" size="xs">
            <ExitUnlockTimerNotification
              date={requestedUnlockDate}
              timeString={requestedUnlockTime}
              className="md:text-xs"
            />
          </CollapsableContent>
        ) : null}
        {state !== NODE_STATE.RUNNING ? (
          <CollapsableContent size="xs">
            <Tooltip
              tooltipContent={dictionary('lastRewardDescription', {
                blockNumber: lastRewardBlock ? formatNumber(lastRewardBlock) : notFoundString,
                date: lastRewardDate
                  ? formatDate(lastRewardDate, { dateStyle: 'full', timeStyle: 'short' })
                  : notFoundString,
              })}
            >
              <span className="text-gray-lightest font-normal">
                {dictionary('lastReward', {
                  relativeTime: lastRewardTime ?? notFoundString,
                })}
              </span>
            </Tooltip>
          </CollapsableContent>
        ) : null}
        {lastUptimeProofSeconds || state === NODE_STATE.RUNNING ? (
          <CollapsableContent size="xs">
            <Tooltip
              tooltipContent={dictionary('lastUptimeDescription', {
                blockNumber: lastUptimeProofSeconds
                  ? formatNumber(
                      blockHeight - msInBlocks(Date.now() - lastUptimeProofSeconds * 1000)
                    )
                  : notFoundString,
                date: lastUptimeDate
                  ? formatDate(lastUptimeDate, { dateStyle: 'full', timeStyle: 'short' })
                  : notFoundString,
              })}
            >
              <span className="text-gray-lightest font-normal">
                {dictionary('lastUptime', { relativeTime: lastUptimeTime ?? notFoundString })}
              </span>
            </Tooltip>
          </CollapsableContent>
        ) : null}
        {/** NOTE - ensure any changes here still work with the pubkey component */}
        <NodeCardText className="flex w-full flex-row flex-wrap gap-1 peer-checked:mt-1 peer-checked:[&>.separator]:opacity-0 md:peer-checked:[&>.separator]:opacity-100 peer-checked:[&>span>span>button]:opacity-100 peer-checked:[&>span>span>div]:block peer-checked:[&>span>span>span]:hidden">
          {walletAddress && isNodeOperator(node, walletAddress) ? (
            <>
              <NodeOperatorIndicator />
              <TextSeparator className="separator mx-1 font-medium" />{' '}
            </>
          ) : null}
          <span className="inline-flex flex-nowrap gap-1">
            <RowLabel>
              {titleFormat('format', { title: generalNodeDictionary('publicKeyShort') })}
            </RowLabel>
            <PubKey pubKey={pubKey} alwaysShowCopyButton />
          </span>
        </NodeCardText>
        <CollapsableContent className="inline-flex flex-wrap peer-checked:max-h-12 sm:gap-1 sm:peer-checked:max-h-5">
          <RowLabel>
            {titleFormat('format', { title: generalNodeDictionary('operatorAddress') })}
          </RowLabel>
          <PubKey pubKey={operatorAddress} expandOnHoverDesktopOnly />
        </CollapsableContent>
        <CollapsableContent>
          <RowLabel>
            {titleFormat('format', { title: stakingNodeDictionary('stakedBalance') })}
          </RowLabel>
          {formattedStakeBalance}
        </CollapsableContent>
        {!isSoloNode ? (
          <CollapsableContent>
            <RowLabel>
              {titleFormat('format', { title: generalNodeDictionary('operatorFee') })}
            </RowLabel>
            {operatorFee !== null ? formatPercentage(operatorFee) : notFoundString}
          </CollapsableContent>
        ) : null}
        {showRawNodeData ? (
          <>
            <CollapsableContent className="hidden peer-checked:block">
              <RowLabel>
                {titleFormat('format', { title: generalNodeDictionary('rawData') })}
              </RowLabel>
            </CollapsableContent>
            <CollapsableContent className="hidden peer-checked:block peer-checked:h-2" size="xs">
              <ActionModuleDivider className="h-0.5" />
            </CollapsableContent>
            {Object.entries(node).map(([key, value]) => {
              const valueToDisplay = JSON.stringify(value);
              return (
                <CollapsableContent
                  size="xs"
                  key={key}
                  className={cn(
                    'hidden peer-checked:block',
                    valueToDisplay.length > 100 ? 'peer-checked:max-h-8' : ''
                  )}
                >
                  <RowLabel>{`${key}: `}</RowLabel>
                  <span>{valueToDisplay}</span>
                </CollapsableContent>
              );
            })}
          </>
        ) : null}
        {!hideButton ? (
          isReadyToExit(node, blockHeight) ? (
            <NodeExitButtonDialog node={node} />
          ) : (isRequestingToExit(node, blockHeight) && !isBeingDeregistered(node)) ||
            hasDeregistrationUnlockHeight(node) ? (
            <Tooltip
              tooltipContent={dictionary('exit.disabledButtonTooltipContent', {
                relativeTime: deregistrationUnlockTime ?? requestedUnlockTime ?? notFoundString,
                date: deregistrationUnlockDate
                  ? formatDate(deregistrationUnlockDate, { dateStyle: 'full', timeStyle: 'short' })
                  : requestedUnlockDate
                    ? formatDate(requestedUnlockDate, { dateStyle: 'full', timeStyle: 'short' })
                    : notFoundString,
              })}
            >
              <NodeExitButton disabled />
            </Tooltip>
          ) : !hasExited(node) ? (
            <NodeRequestExitButton node={node} />
          ) : null
        ) : null}
      </NodeCard>
    );
  }
);
StakedNodeCard.displayName = 'StakedNodeCard';

export { StakedNodeCard };
