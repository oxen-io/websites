'use client';
import { formatTimeDistanceToNowClient } from '@/lib/locale-client';
import { NodeCardDataTestId, StakedNodeDataTestId } from '@/testing/data-test-ids';
import { SENT_SYMBOL } from '@session/contracts';
import { NODE_STATE } from '@session/sent-staking-js';
import { StatusIndicator, statusVariants } from '@session/ui/components/StatusIndicator';
import { ArrowDownIcon } from '@session/ui/icons/ArrowDownIcon';
import { HumanIcon } from '@session/ui/icons/HumanIcon';
import { cn } from '@session/ui/lib/utils';
import { type VariantProps } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import { forwardRef, useId, useMemo, type HTMLAttributes } from 'react';
import { NodeCard, NodeCardText, NodeCardTitle, NodePubKey } from './NodeCard';

export const NODE_STATE_VALUES = Object.values(NODE_STATE);

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

const isUnlocking = (node: StakedNode): node is UnlockedStakedNode =>
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

const NodeLiquidationNotification = () => (
  <span className="text-destructive">• Awaiting liquidation</span>
);

const NodeDeregistrationNotification = ({ deregistrationDate }: { deregistrationDate: Date }) => (
  <span className="text-destructive">
    • {'Deregistration'} {formatTimeDistanceToNowClient(deregistrationDate, { addSuffix: true })}
  </span>
);

const NodeUnlockNotification = ({ unlockDate }: { unlockDate: Date }) => (
  <span className="text-orange-500">
    • Unlocking {formatTimeDistanceToNowClient(unlockDate, { addSuffix: true })}
  </span>
);

type StakedNodeContributorListProps = HTMLAttributes<HTMLDivElement> & {
  node: Pick<StakedNode, 'contributors' | 'state'>;
  expanded?: boolean;
};

const StakedNodeContributorList = forwardRef<HTMLDivElement, StakedNodeContributorListProps>(
  ({ className, node: { contributors, state }, expanded, ...props }, ref) => {
    const id = useId();
    return (
      <div
        className={cn('mb-0.5 flex flex-row items-center gap-1 align-middle', className)}
        ref={ref}
        {...props}
        id={id}
        key={id}
      >
        <HumanIcon
          id={id + 'first'}
          key={id + 'first'}
          className="h-4 w-4"
          full={contributors.length > 0}
        />
        {Array.from({
          length: state === NODE_STATE.AWAITING_CONTRIBUTORS ? 9 : contributors.length - 1,
        }).map((_, i) => (
          <HumanIcon
            id={id + i}
            key={id + i}
            full={i + 1 < contributors.length}
            className={cn('h-4 w-4', expanded ? 'block' : 'hidden')}
          />
        ))}
        <span className={cn('block text-lg', expanded && 'hidden')}>
          {contributors.length}
          {state === NODE_STATE.AWAITING_CONTRIBUTORS ? '/10' : null}
        </span>
      </div>
    );
  }
);

const StakedNodeCard = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { node: StakedNode }
>(({ className, node, ...props }, ref) => {
  const dictionary = useTranslations('nodeCard.staked');
  const id = useId();
  const { state, pubKey, balance, operatorFee, lastRewardHeight, lastUptime } = node;

  const nodeNotification = useMemo(() => {
    if (isAwaitingLiquidation(node)) {
      return <NodeLiquidationNotification />;
    }

    if (isBeingDeregistered(node)) {
      return <NodeDeregistrationNotification deregistrationDate={node.deregistrationDate} />;
    }

    if (isBeingUnlocked(node)) {
      return <NodeUnlockNotification unlockDate={node.unlockDate} />;
    }

    return null;
  }, [node]);

  return (
    <NodeCard
      ref={ref}
      {...props}
      className={cn('flex flex-row flex-wrap items-center gap-3 align-middle', className)}
      data-testid={NodeCardDataTestId.Staked_Node}
    >
      <input type="checkbox" className="peer hidden appearance-none" id={id} key={id} />
      <StatusIndicator
        status={getNodeStatus(state)}
        className="mb-1"
        data-testid={StakedNodeDataTestId.Indicator}
      />
      <NodeCardTitle data-testid={StakedNodeDataTestId.Title}>{state}</NodeCardTitle>
      {nodeNotification ? (
        <span data-testid={StakedNodeDataTestId.Notification}>{nodeNotification}</span>
      ) : state == NODE_STATE.AWAITING_CONTRIBUTORS || state == NODE_STATE.RUNNING ? (
        <>
          <StakedNodeContributorList
            node={node}
            data-testid={StakedNodeDataTestId.Contributor_List}
            className="peer-checked:hidden"
          />
          <StakedNodeContributorList
            node={node}
            data-testid={StakedNodeDataTestId.Contributor_List}
            expanded
            className="hidden peer-checked:flex"
          />
        </>
      ) : null}
      <label
        className="flex flex-grow cursor-pointer items-center justify-end align-middle peer-checked:hidden"
        htmlFor={id}
        aria-label={dictionary('ariaExpand')}
        role="button"
        data-testid={StakedNodeDataTestId.Expand_Button}
      >
        <span className="hidden xl:block">{dictionary('expand')}</span>
        <ArrowDownIcon className="ml-1 h-4 w-4" />
      </label>
      <label
        className="hidden flex-grow cursor-pointer items-center justify-end align-middle peer-checked:flex"
        htmlFor={id}
        aria-label={dictionary('ariaCollapse')}
        role="button"
        data-testid={StakedNodeDataTestId.Collapse_Button}
      >
        <span className="hidden xl:block">{dictionary('collapse')}</span>
        <ArrowDownIcon className="ml-1 h-4 w-4 rotate-180 transform" />
      </label>
      <div className="mt-3 hidden max-h-0 w-full flex-col align-middle peer-checked:flex peer-checked:max-h-max">
        <div className="mb-2 flex flex-col text-xs opacity-60">
          {isBeingDeregistered(node) && isBeingUnlocked(node) ? (
            <NodeUnlockNotification unlockDate={node.unlockDate} />
          ) : null}
          <span className="font-medium">Last Reward Height: {lastRewardHeight}</span>
          <span className="font-medium">
            {dictionary('lastUptime')} {formatTimeDistanceToNowClient(lastUptime)}
          </span>
        </div>
      </div>
      <NodeCardText className="flex w-full flex-row gap-1 peer-checked:[&>div>button]:block peer-checked:[&>div>div]:block peer-checked:[&>div>span]:hidden">
        <span className="font-semibold">{dictionary('pubKey')}</span> <NodePubKey pubKey={pubKey} />
      </NodeCardText>
      <div className="hidden max-h-0 w-full flex-col align-middle peer-checked:flex peer-checked:max-h-max">
        <NodeCardText>
          <span className="font-semibold">{dictionary('balance')}</span> {balance.toFixed(2)}{' '}
          {SENT_SYMBOL}
        </NodeCardText>
        <NodeCardText>
          <span className="font-semibold">{dictionary('operatorFee')}</span>{' '}
          {(operatorFee * 100).toFixed(2)}%
        </NodeCardText>
      </div>
    </NodeCard>
  );
});
StakedNodeCard.displayName = 'StakedNodeCard';

export { StakedNodeCard };
