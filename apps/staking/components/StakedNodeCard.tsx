'use client';

import { formatLocalizedRelativeTimeToNowClient, formatPercentage } from '@/lib/locale-client';
import { NodeCardDataTestId, StakedNodeDataTestId } from '@/testing/data-test-ids';
import { NODE_STATE } from '@session/sent-staking-js';
import { TextSeparator } from '@session/ui/components/Separator';
import { StatusIndicator, statusVariants } from '@session/ui/components/StatusIndicator';
import { ArrowDownIcon } from '@session/ui/icons/ArrowDownIcon';
import { HumanIcon } from '@session/ui/icons/HumanIcon';
import { SpannerAndScrewdriverIcon } from '@session/ui/icons/SpannerAndScrewdriverIcon';
import { cn } from '@session/ui/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@session/ui/ui/tooltip';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import { forwardRef, useId, useMemo, useState, type HTMLAttributes } from 'react';
import { NodeCard, NodeCardText, NodeCardTitle, NodePubKey } from './NodeCard';

export const NODE_STATE_VALUES = Object.values(NODE_STATE);

// #region - Types

interface Contributor {
  address: string;
  amount: number;
}

export interface GenericStakedNode {
  state: NODE_STATE;
  contributors: Contributor[];
  lastRewardHeight: number;
  lastUptime: Date;
  pubKey: string;
  balance: number;
  operatorFee: number;
  operator_address: string;
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
  requiresLiquidation?: boolean;
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
// #region - Assertions
/** Type assertions */
const isRunning = (node: StakedNode): node is RunningStakedNode =>
  node.state === NODE_STATE.RUNNING;

const isAwaitingContributors = (node: StakedNode): node is AwaitingContributorsStakedNode =>
  node.state === NODE_STATE.AWAITING_CONTRIBUTORS;

const isCancelled = (node: StakedNode): node is CancelledStakedNode =>
  node.state === NODE_STATE.CANCELLED;

const isDecommissioned = (node: StakedNode): node is DecommissionedStakedNode =>
  node.state === NODE_STATE.DECOMMISSIONED;

const isDeregistered = (node: StakedNode): node is DeregisteredStakedNode =>
  node.state === NODE_STATE.DEREGISTERED;

const isUnlocked = (node: StakedNode): node is UnlockedStakedNode =>
  node.state === NODE_STATE.UNLOCKED;

/** State assertions */

/**
 * Checks if a node is being deregistered.
 * @param node - The node to check.
 * @returns `true` if the node is being deregistered, `false` otherwise.
 */
const isBeingDeregistered = (
  node: StakedNode
): node is DecommissionedStakedNode & { deregistrationDate: Date } =>
  'deregistrationDate' in node && node.deregistrationDate !== undefined;

const isBeingUnlocked = (
  node: StakedNode
): node is (RunningStakedNode | DecommissionedStakedNode) & { unlockDate: Date } =>
  'unlockDate' in node && node.unlockDate !== undefined;

/**
 * Checks if a given node is awaiting liquidation.
 * @param node - The deregistered session node to check.
 * @returns A boolean indicating whether the node requires liquidation.
 */
const isAwaitingLiquidation = (node: StakedNode): boolean =>
  'requiresLiquidation' in node && node.requiresLiquidation === true;

/**
 * Checks if a given node is operated by a specific operator.
 * @param node - The session node to check.
 * @param operatorAddress - The address of the operator to compare with.
 * @returns `true` if the node is operated by the specified operator, `false` otherwise.
 */
const isNodeOperator = (node: StakedNode, operatorAddress: string): boolean =>
  node.operator_address === operatorAddress;

/**
 * Checks if a given contributor address is a contributor of a session node.
 *
 * @param node - The session node to check.
 * @param contributorAddress - The address of the contributor to check.
 * @returns `true` if the contributor address is a contributor of the session node, `false` otherwise.
 */
const isNodeContributor = (node: StakedNode, contributorAddress: string): boolean =>
  node.contributors.some(({ address }) => address === contributorAddress);

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

// #region - Components

type StakedNodeContributorListProps = HTMLAttributes<HTMLDivElement> & {
  contributors: Contributor[];
  showEmptySlots?: boolean;
  expanded?: boolean;
};

const StakedNodeContributorList = forwardRef<HTMLDivElement, StakedNodeContributorListProps>(
  ({ className, contributors, showEmptySlots, ...props }, ref) => {
    const { address: userAddress } = useWallet();

    const userContributor = useMemo(
      () => contributors.find(({ address }) => address === userAddress),
      [contributors]
    );

    const otherContributors = useMemo(
      () => contributors.filter(({ address }) => address !== userAddress),
      [contributors]
    );

    const emptyContributorSlots = useMemo(
      () =>
        showEmptySlots
          ? Array.from(
              {
                length: 10 - contributors.length,
              },
              (_, index) => `empty-slot-${index}`
            )
          : [],
      [showEmptySlots, contributors.length]
    );

    return (
      <>
        <ContributorIcon className="-mr-1" contributor={userContributor} isUser />
        <div
          className={cn(
            'flex w-min flex-row items-center overflow-x-hidden align-middle md:peer-checked:gap-1 [&>span]:w-max [&>span]:opacity-100 md:peer-checked:[&>span]:w-0 md:peer-checked:[&>span]:opacity-0 [&>svg]:w-0 [&>svg]:transition-all [&>svg]:duration-300 [&>svg]:motion-reduce:transition-none md:peer-checked:[&>svg]:w-4',
            className
          )}
          ref={ref}
          {...props}
        >
          {otherContributors.map((contributor) => (
            <ContributorIcon
              key={contributor.address}
              contributor={contributor}
              className={cn('fill-text-primary h-4')}
            />
          ))}
          {showEmptySlots
            ? emptyContributorSlots.map((key) => (
                <ContributorIcon key={key} className="fill-text-primary h-4" />
              ))
            : null}
          <span className={cn('mt-0.5 block text-lg transition-all duration-300 ease-in-out')}>
            {contributors.length}
            {showEmptySlots ? '/10' : null}
          </span>
        </div>
      </>
    );
  }
);

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
        level === 'warning' ? 'text-warning' : level === 'error' ? 'text-destructive' : 'text-info',
        className
      )}
      {...props}
    >
      <span>•</span>
      {children}
    </span>
  )
);

const NodeOperatorIndicator = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    const dictionary = useTranslations('nodeCard.staked');

    return (
      <>
        <span
          ref={ref}
          className={cn(
            'text-session-green flex w-max flex-row items-center gap-1 align-middle text-sm font-normal sm:w-max md:text-base',
            className
          )}
          {...props}
        >
          <SpannerAndScrewdriverIcon className="fill-session-green mb-1 h-3.5 w-3.5" />
          <span>{dictionary('operator')}</span>
        </span>
        <TextSeparator className="mx-1 font-medium" />
      </>
    );
  }
);

const ContributorIcon = ({
  className,
  contributor,
  isUser,
}: {
  className?: string;
  contributor?: Contributor;
  isUser?: boolean;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <HumanIcon
        className={cn('fill-text-primary h-4 w-4 cursor-pointer', className)}
        full={Boolean(contributor)}
      />
    </TooltipTrigger>
    <TooltipContent>
      <p>
        {contributor
          ? `${isUser ? 'You' : ''} ${contributor.address} | ${contributor.amount}`
          : 'Empty contributor slot'}
      </p>
    </TooltipContent>
  </Tooltip>
);

const NodeSummary = ({ node }: { node: StakedNode }) => {
  const dictionary = useTranslations('nodeCard.staked');
  if (isAwaitingLiquidation(node)) {
    return (
      <NodeNotification level="error">{dictionary('liquidationNotification')}</NodeNotification>
    );
  }

  if (isBeingDeregistered(node)) {
    return (
      <NodeNotification level="error">
        {dictionary('deregistrationTimerNotification', {
          time: formatLocalizedRelativeTimeToNowClient(node.deregistrationDate, {
            addSuffix: true,
          }),
        })}
      </NodeNotification>
    );
  }

  if (isBeingUnlocked(node)) {
    return (
      <NodeNotification level="warning">
        {dictionary('unlockingTimerNotification', {
          time: formatLocalizedRelativeTimeToNowClient(node.unlockDate, { addSuffix: true }),
        })}
      </NodeNotification>
    );
  }

  if (node.state === NODE_STATE.AWAITING_CONTRIBUTORS || node.state === NODE_STATE.RUNNING) {
    //separate user from others

    return (
      <StakedNodeContributorList
        contributors={node.contributors}
        showEmptySlots={node.state === NODE_STATE.AWAITING_CONTRIBUTORS}
        data-testid={StakedNodeDataTestId.Contributor_List}
      />
    );
  }

  return null;
};

const collapsableContentVariants = cva(
  'h-full max-h-0 w-full select-none gap-1 overflow-y-hidden transition-all duration-300 ease-in-out peer-checked:select-auto motion-reduce:transition-none',
  {
    variants: {
      size: {
        xs: 'text-xs md:text-xs peer-checked:max-h-4',
        base: 'text-sm md:text-base peer-checked:max-h-6',
      },
    },
    defaultVariants: {
      size: 'base',
    },
  }
);

type CollapsableContentProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof collapsableContentVariants>;

const CollapsableContent = forwardRef<HTMLDivElement, CollapsableContentProps>(
  ({ className, size, ...props }, ref) => (
    <NodeCardText
      ref={ref}
      className={cn(collapsableContentVariants({ size, className }))}
      {...props}
    />
  )
);

const StakedNodeCard = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { node: StakedNode }
>(({ className, node, ...props }, ref) => {
  const dictionary = useTranslations('nodeCard.staked');
  const id = useId();
  const { address } = useWallet();
  const { state, pubKey, balance, operatorFee, lastRewardHeight, lastUptime } = node;

  return (
    <NodeCard
      ref={ref}
      {...props}
      className={cn(
        'flex flex-row flex-wrap items-center gap-x-2 gap-y-0.5 overflow-hidden pb-4 align-middle',
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
      {isBeingDeregistered(node) && isBeingUnlocked(node) ? (
        <CollapsableContent className="text-warning" size="xs">
          {dictionary('unlockingTimerNotification', {
            time: formatLocalizedRelativeTimeToNowClient(node.unlockDate, { addSuffix: true }),
          })}
        </CollapsableContent>
      ) : null}
      {state === NODE_STATE.DECOMMISSIONED ||
      state === NODE_STATE.DEREGISTERED ||
      state === NODE_STATE.UNLOCKED ? (
        <CollapsableContent className="font-medium opacity-60" size="xs">
          {dictionary('lastRewardHeight', { height: lastRewardHeight })}
        </CollapsableContent>
      ) : null}
      <CollapsableContent className="font-medium opacity-60" size="xs">
        {dictionary('lastUptime', { time: formatLocalizedRelativeTimeToNowClient(lastUptime) })}
      </CollapsableContent>
      <NodeCardText className="flex w-full flex-row gap-1 peer-checked:[&>span>span>button]:block peer-checked:[&>span>span>div]:block peer-checked:[&>span>span>span]:hidden">
        {/** TODO - Investigating having react components as localized variables */}
        <span className="flex flex-row gap-1">
          {address && isNodeOperator(node, address) ? <NodeOperatorIndicator /> : null}
          {dictionary.rich('pubKey', { pubKey: '' })}
          <NodePubKey pubKey={pubKey} />
        </span>
      </NodeCardText>
      <CollapsableContent>
        {dictionary.rich('stakedBalance', {
          balance: `${balance.toFixed(2)}`,
        })}
      </CollapsableContent>
      <CollapsableContent>
        {dictionary.rich('operatorFee', {
          fee: formatPercentage(operatorFee),
        })}
      </CollapsableContent>
    </NodeCard>
  );
});
StakedNodeCard.displayName = 'StakedNodeCard';

export { StakedNodeCard };
