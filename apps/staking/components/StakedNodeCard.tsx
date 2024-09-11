'use client';

import {
  formatDate,
  formatLocalizedRelativeTimeToNowClient,
  formatLocalizedTimeFromSeconds,
  formatPercentage,
} from '@/lib/locale-client';
import {
  ButtonDataTestId,
  NodeCardDataTestId,
  StakedNodeDataTestId,
} from '@/testing/data-test-ids';
import { SENT_SYMBOL } from '@session/contracts';
import { NODE_STATE } from '@session/sent-staking-js/client';
import { TextSeparator } from '@session/ui/components/Separator';
import { StatusIndicator, statusVariants } from '@session/ui/components/StatusIndicator';
import { ArrowDownIcon } from '@session/ui/icons/ArrowDownIcon';
import { SpannerAndScrewdriverIcon } from '@session/ui/icons/SpannerAndScrewdriverIcon';
import { cn } from '@session/ui/lib/utils';
import { formatNumber } from '@session/util/maths';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import { forwardRef, type HTMLAttributes, ReactNode, useId, useMemo, useState } from 'react';
import {
  Contributor,
  getTotalStakedAmountForAddress,
  NodeCard,
  NodeCardText,
  NodeCardTitle,
  NodeContributorList,
} from './NodeCard';
import { PubKey } from '@session/ui/components/PubKey';
import { areHexesEqual } from '@session/util/string';
import { Button } from '@session/ui/ui/button';
import { NodeRequestExitButton } from '@/components/StakedNode/NodeRequestExitButton';
import { Tooltip } from '@session/ui/ui/tooltip';
import { SESSION_NODE_TIME, URL } from '@/lib/constants';
import { useChain } from '@session/contracts/hooks/useChain';
import { NodeExitButton } from '@/components/StakedNode/NodeExitButton';
import { NodeExitButtonDialog } from '@/components/StakedNode/NodeExitButtonDialog';
import { externalLink } from '@/lib/locale-defaults';

export const NODE_STATE_VALUES = Object.values(NODE_STATE);

// #region - Types

export interface GenericStakedNode {
  state: NODE_STATE;
  contributors: Contributor[];
  lastRewardHeight: number;
  lastUptime: Date;
  pubKey: string;
  balance: number;
  operatorFee: number;
  operator_address: string;
  contract_id: number;
}

type RunningStakedNode = GenericStakedNode & {
  state: NODE_STATE.RUNNING;
  unlockDate?: Date;
};

type AwaitingContributorsStakedNode = GenericStakedNode & {
  state: NODE_STATE.AWAITING_CONTRIBUTORS;
};

type CancelledStakedNode = GenericStakedNode & { state: NODE_STATE.CANCELLED };

type DecommissionedStakedNode = GenericStakedNode & {
  state: NODE_STATE.DECOMMISSIONED;
  deregistrationDate: Date;
  unlockDate?: Date;
};

type DeregisteredStakedNode = GenericStakedNode & {
  state: NODE_STATE.DEREGISTERED;
  awaitingLiquidation?: boolean;
};

type UnlockedStakedNode = GenericStakedNode & {
  state: NODE_STATE.UNLOCKED;
};

export type StakedNode =
  | RunningStakedNode
  | AwaitingContributorsStakedNode
  | CancelledStakedNode
  | DecommissionedStakedNode
  | DeregisteredStakedNode
  | UnlockedStakedNode;

// #endregion
// #region - Assertions
/** Type assertions */
// const isRunning = (node: StakedNode): node is RunningStakedNode =>
//   node.state === NODE_STATE.RUNNING;
//
// const isAwaitingContributors = (node: StakedNode): node is AwaitingContributorsStakedNode =>
//   node.state === NODE_STATE.AWAITING_CONTRIBUTORS;
//
// const isCancelled = (node: StakedNode): node is CancelledStakedNode =>
//   node.state === NODE_STATE.CANCELLED;
//
// const isDecommissioned = (node: StakedNode): node is DecommissionedStakedNode =>
//   node.state === NODE_STATE.DECOMMISSIONED;
//
// const isDeregistered = (node: StakedNode): node is DeregisteredStakedNode =>
//   node.state === NODE_STATE.DEREGISTERED;
//
// const isUnlocked = (node: StakedNode): node is UnlockedStakedNode =>
//   node.state === NODE_STATE.UNLOCKED;

/** State assertions */

/**
 * Checks if a node is being deregistered.
 * @param node - The node to check.
 * @returns `true` if the node is being deregistered, `false` otherwise.
 */
const isBeingDeregistered = (node: StakedNode): node is DecommissionedStakedNode =>
  !!(
    node.state === NODE_STATE.DECOMMISSIONED &&
    'deregistrationDate' in node &&
    node.deregistrationDate
  );

const hasUnlockDate = (
  node: StakedNode
): node is (RunningStakedNode | DecommissionedStakedNode) & { unlockDate: Date } =>
  !!('unlockDate' in node && node.unlockDate);

const isRequestingToExit = (
  node: StakedNode
): node is (RunningStakedNode | DecommissionedStakedNode) & { unlockDate: Date } =>
  !!(hasUnlockDate(node) && node.unlockDate.getTime() >= Date.now());

const isReadyToExit = (
  node: StakedNode
): node is (RunningStakedNode | DecommissionedStakedNode) & { unlockDate: Date } =>
  !!(hasUnlockDate(node) && node.unlockDate.getTime() < Date.now());

/**
 * Checks if a given node is awaiting liquidation.
 * @param node - The deregistered session node to check.
 * @returns A boolean indicating whether the node requires liquidation.
 */
const isAwaitingLiquidation = (node: StakedNode): boolean =>
  'awaitingLiquidation' in node && node.awaitingLiquidation === true;

/**
 * Checks if a given node is operated by a specific operator.
 * @param node - The session node to check.
 * @param operatorAddress - The address of the operator to compare with.
 * @returns `true` if the node is operated by the specified operator, `false` otherwise.
 */
const isNodeOperator = (node: StakedNode, operatorAddress: string): boolean =>
  areHexesEqual(node.operator_address, operatorAddress);

/**
 * Checks if a given contributor address is a contributor of a session node.
 *
 * @param node - The session node to check.
 * @param contributorAddress - The address of the contributor to check.
 * @returns `true` if the contributor address is a contributor of the session node, `false` otherwise.
 */
const isNodeContributor = (node: StakedNode, contributorAddress: string): boolean =>
  node.contributors.some(({ address }) => areHexesEqual(address, contributorAddress));

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
    case NODE_STATE.UNLOCKED:
    default:
      return 'grey';
  }
}

// #endregion
// #region - Components

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

        <TextSeparator className="mx-1 font-medium" />
      </>
    );
  }
);

const ReadyForExitNotification = ({
  node,
  className,
}: {
  node: Required<RunningStakedNode> | Required<DecommissionedStakedNode>;
  className?: string;
}) => {
  const chain = useChain();
  const dictionary = useTranslations('nodeCard.staked');
  const time = formatLocalizedTimeFromSeconds(
    node.unlockDate.getTime() / 1000 + SESSION_NODE_TIME(chain).EXIT_GRACE_TIME_SECONDS,
    { addSuffix: true }
  );

  return (
    <Tooltip
      tooltipContent={dictionary('exitTimerDescription', {
        time,
      })}
    >
      <NodeNotification level="warning" className={className}>
        {dictionary.rich('exitTimerNotification', {
          time,
          link: externalLink(URL.NODE_LIQUIDATION_LEARN_MORE),
        })}
      </NodeNotification>
    </Tooltip>
  );
};

const RequestingExitNotification = ({
  node,
  className,
}: {
  node: Required<RunningStakedNode> | Required<DecommissionedStakedNode>;
  className?: string;
}) => {
  const dictionary = useTranslations('nodeCard.staked');
  return (
    <Tooltip
      tooltipContent={dictionary('requestingExitDescription', {
        relative_time: formatLocalizedRelativeTimeToNowClient(node.unlockDate, {
          addSuffix: true,
        }),
        date: formatDate(node.unlockDate, { dateStyle: 'full', timeStyle: 'long' }),
      })}
    >
      <NodeNotification level="warning" className={className}>
        {dictionary('requestingExitTimerNotification', {
          time: formatLocalizedRelativeTimeToNowClient(node.unlockDate, { addSuffix: true }),
        })}
      </NodeNotification>
    </Tooltip>
  );
};

const DeregisteringNotification = ({ node }: { node: DecommissionedStakedNode }) => {
  const chain = useChain();
  const dictionary = useTranslations('nodeCard.staked');
  const generalDictionary = useTranslations('general');
  return (
    <Tooltip
      tooltipContent={dictionary('deregistrationTimerDescription', {
        deregistration_locked_stake_time: formatLocalizedTimeFromSeconds(
          SESSION_NODE_TIME(chain).DEREGISTRATION_LOCKED_STAKE_SECONDS,
          { unit: 'day' }
        ),
        relative_time: formatLocalizedRelativeTimeToNowClient(node.deregistrationDate, {
          addSuffix: true,
        }),
        date: formatDate(node.deregistrationDate, {
          dateStyle: 'full',
          timeStyle: 'long',
        }),
      })}
    >
      <NodeNotification level="error">
        {dictionary('deregistrationTimerNotification', {
          time: node.deregistrationDate
            ? formatLocalizedRelativeTimeToNowClient(node.deregistrationDate, {
                addSuffix: true,
              })
            : generalDictionary('soon'),
        })}
      </NodeNotification>
    </Tooltip>
  );
};

const NodeSummary = ({ node }: { node: StakedNode }) => {
  const dictionary = useTranslations('nodeCard.staked');

  if (isAwaitingLiquidation(node)) {
    return (
      <NodeNotification level="info">{dictionary('liquidationNotification')}</NodeNotification>
    );
  }

  if (isBeingDeregistered(node)) {
    return <DeregisteringNotification node={node} />;
  }

  if (isRequestingToExit(node)) {
    return (
      <>
        <NodeContributorList
          contributors={node.contributors}
          data-testid={StakedNodeDataTestId.Contributor_List}
        />
        <RequestingExitNotification node={node} />
      </>
    );
  }

  if (isReadyToExit(node)) {
    return (
      <>
        <NodeContributorList
          contributors={node.contributors}
          data-testid={StakedNodeDataTestId.Contributor_List}
        />
        <RequestingExitNotification node={node} />
      </>
    );
  }

  if (node.state === NODE_STATE.AWAITING_CONTRIBUTORS || node.state === NODE_STATE.RUNNING) {
    return (
      <NodeContributorList
        contributors={node.contributors}
        showEmptySlots={node.state === NODE_STATE.AWAITING_CONTRIBUTORS}
        data-testid={StakedNodeDataTestId.Contributor_List}
      />
    );
  }

  return null;
};

const collapsableContentVariants = cva(
  'h-full max-h-0 select-none gap-1 overflow-y-hidden transition-all duration-300 ease-in-out peer-checked:select-auto motion-reduce:transition-none',
  {
    variants: {
      size: {
        xs: 'text-xs md:text-xs peer-checked:max-h-4',
        base: cn('text-sm peer-checked:max-h-5', 'md:text-base md:peer-checked:max-h-6'),
        buttonMd: cn('peer-checked:max-h-8', 'md:peer-checked:max-h-10'),
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
  }
>(({ ariaLabel, dataTestId, disabled, children, ...props }, ref) => (
  <CollapsableContent className="absolute bottom-4 right-6 flex w-max items-end" size="buttonMd">
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

const StakedNodeCard = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { node: StakedNode }
>(({ className, node, ...props }, ref) => {
  const dictionary = useTranslations('nodeCard.staked');
  const generalDictionary = useTranslations('general');
  const generalNodeDictionary = useTranslations('sessionNodes.general');
  const stakingNodeDictionary = useTranslations('sessionNodes.staking');
  const titleFormat = useTranslations('modules.title');

  const id = useId();
  const { address } = useWallet();
  const { state, pubKey, operatorFee, lastRewardHeight, lastUptime, contributors } = node;

  const formattedTotalStakedAmount = useMemo(() => {
    if (!contributors || contributors.length === 0 || !address) return '0';
    return formatNumber(getTotalStakedAmountForAddress(contributors, address));
  }, [contributors, address]);

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
      <input id={id} type="checkbox" className="peer hidden appearance-none" />
      <StatusIndicator
        status={getNodeStatus(state)}
        className="mb-1"
        data-testid={StakedNodeDataTestId.Indicator}
      />
      <NodeCardTitle data-testid={StakedNodeDataTestId.Title}>{state}</NodeCardTitle>
      <NodeSummary node={node} />
      <ToggleCardExpansionButton htmlFor={id} />
      {isBeingDeregistered(node) && isRequestingToExit(node) ? (
        <CollapsableContent className="text-warning" size="xs">
          <RequestingExitNotification node={node} className="md:text-xs" />
        </CollapsableContent>
      ) : null}
      {state === NODE_STATE.DECOMMISSIONED ||
      state === NODE_STATE.DEREGISTERED ||
      state === NODE_STATE.UNLOCKED ? (
        <CollapsableContent className="font-medium opacity-75" size="xs">
          {dictionary('lastRewardHeight', {
            height: lastRewardHeight ? lastRewardHeight : generalDictionary('notFound'),
          })}
        </CollapsableContent>
      ) : null}
      <CollapsableContent className="font-medium" size="xs">
        <Tooltip tooltipContent={formatDate(lastUptime, { dateStyle: 'full', timeStyle: 'long' })}>
          <span className="opacity-75">
            {dictionary('lastUptime', {
              time: lastUptime.getTime()
                ? formatLocalizedRelativeTimeToNowClient(lastUptime, { addSuffix: true })
                : generalDictionary('notFound'),
            })}
          </span>
        </Tooltip>
      </CollapsableContent>
      {/** NOTE - ensure any changes here still work with the pubkey component */}
      <NodeCardText className="flex w-full flex-row flex-wrap gap-1 peer-checked:mt-1 peer-checked:[&>span>span>button]:opacity-100 peer-checked:[&>span>span>div]:block peer-checked:[&>span>span>span]:hidden">
        {address && isNodeOperator(node, address) ? <NodeOperatorIndicator /> : null}
        <span className="inline-flex flex-nowrap gap-1">
          <RowLabel>
            {titleFormat('format', { title: generalNodeDictionary('publicKeyShort') })}
          </RowLabel>
          <PubKey pubKey={pubKey} expandOnHover={true} />
        </span>
      </NodeCardText>
      <CollapsableContent className="inline-flex gap-1">
        <RowLabel>
          {titleFormat('format', { title: generalNodeDictionary('operatorAddress') })}
        </RowLabel>
        <PubKey pubKey={node.operator_address} expandOnHover={true} />
      </CollapsableContent>
      <CollapsableContent>
        <RowLabel>
          {titleFormat('format', { title: stakingNodeDictionary('stakedBalance') })}
        </RowLabel>
        {formattedTotalStakedAmount} {SENT_SYMBOL}
      </CollapsableContent>
      {!isSoloNode ? (
        <CollapsableContent>
          <RowLabel>
            {titleFormat('format', { title: generalNodeDictionary('operatorFee') })}
          </RowLabel>
          {formatPercentage(operatorFee)}
        </CollapsableContent>
      ) : null}
      {state === NODE_STATE.RUNNING ? (
        isReadyToExit(node) ? (
          <NodeExitButtonDialog node={node} />
        ) : isRequestingToExit(node) ? (
          <Tooltip
            tooltipContent={dictionary('exit.disabledButtonTooltipContent', {
              relative_time: formatLocalizedRelativeTimeToNowClient(node.unlockDate, {
                addSuffix: true,
              }),
              date: formatDate(node.unlockDate, { dateStyle: 'full', timeStyle: 'long' }),
            })}
          >
            <NodeExitButton disabled />
          </Tooltip>
        ) : (
          <NodeRequestExitButton node={node} />
        )
      ) : null}
    </NodeCard>
  );
});
StakedNodeCard.displayName = 'StakedNodeCard';

// #endregion

export { StakedNodeCard };
