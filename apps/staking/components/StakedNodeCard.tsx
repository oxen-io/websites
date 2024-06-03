'use client';
import { formatTimeDistanceToNowClient } from '@/lib/locale-client';
import { NODE_STATE } from '@session/sent-staking-js';
import { StatusIndicator, statusVariants } from '@session/ui/components/StatusIndicator';
import { ArrowDownIcon } from '@session/ui/icons/ArrowDownIcon';
import { HumanIcon } from '@session/ui/icons/HumanIcon';
import { cn } from '@session/ui/lib/utils';
import { type VariantProps } from 'class-variance-authority';
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
  deregistrationDate?: Date;
};

type AwaitingContributorsStakedNode = GenericStakedNode & {
  state: NODE_STATE.AWAITING_CONTRIBUTORS;
};

type CancelledStakedNode = GenericStakedNode & { state: NODE_STATE.CANCELLED };

type DecommissionedStakedNode = GenericStakedNode & {
  state: NODE_STATE.DECOMMISSIONED;
  deregistrationDate: Date;
};

type DeregisteredStakedNode = GenericStakedNode & {
  state: NODE_STATE.DEREGISTERED;
  requiresLiquidation?: boolean;
};

type VoluntaryDeregistrationStakedNode = GenericStakedNode & {
  state: NODE_STATE.VOLUNTARY_DEREGISTRATION;
};

export type StakedNode =
  | RunningStakedNode
  | AwaitingContributorsStakedNode
  | CancelledStakedNode
  | DecommissionedStakedNode
  | DeregisteredStakedNode
  | VoluntaryDeregistrationStakedNode;

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

const isVoluntaryDeregistration = (node: StakedNode): node is VoluntaryDeregistrationStakedNode =>
  node.state === NODE_STATE.VOLUNTARY_DEREGISTRATION;

/** State assertions */

/**
 * Checks if a node is being deregistered.
 * @param node - The node to check.
 * @returns `true` if the node is being deregistered, `false` otherwise.
 */
const isBeingDeregistered = (
  node: StakedNode
): node is (RunningStakedNode | DecommissionedStakedNode) & { deregistrationDate: Date } =>
  'deregistrationDate' in node && node.deregistrationDate !== undefined;

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
    case NODE_STATE.VOLUNTARY_DEREGISTRATION:
    default:
      return 'grey';
  }
}

const StakedNodeContributorList = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { node: Pick<StakedNode, 'contributors' | 'state'> }
>(({ className, node: { contributors, state }, ...props }, ref) => {
  return (
    <div
      className={cn('-mb-0.5 flex flex-row gap-1 self-baseline align-baseline', className)}
      ref={ref}
      {...props}
    >
      {Array.from({
        length: state === NODE_STATE.AWAITING_CONTRIBUTORS ? 10 : contributors.length,
      }).map((_, i) => (
        <HumanIcon
          key={i}
          full={i < contributors.length}
          className={cn(i === 0 ? 'block' : 'hidden xl:block')}
        />
      ))}
      <span className={'block text-xl xl:hidden'}>
        {contributors.length}
        {state === NODE_STATE.AWAITING_CONTRIBUTORS ? '/10' : null}
      </span>
    </div>
  );
});

const StakedNodeCard = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { node: StakedNode }
>(({ className, node, ...props }, ref) => {
  const id = useId();
  const { state, pubKey, balance, operatorFee, lastRewardHeight, lastUptime } = node;

  const nodeNotification = useMemo(() => {
    if (isBeingDeregistered(node)) {
      return (
        <span className="text-orange-400">
          • {formatTimeDistanceToNowClient(node.deregistrationDate)}{' '}
          {state === NODE_STATE.RUNNING ? ' till voluntary deregistration' : ' till deregistration'}
        </span>
      );
    }

    if (isAwaitingLiquidation(node)) {
      return <span className="text-red-500">• Awaiting liquidation</span>;
    }

    return null;
  }, [node]);

  return (
    <NodeCard ref={ref} {...props}>
      <div className={cn('grid grid-cols-10', className)}>
        <label
          className="col-span-8 flex w-full cursor-pointer items-baseline gap-4 align-middle"
          htmlFor={id}
          aria-label="Toggle details expansion"
          title="Toggle details expansion"
        >
          <div className="p-0.5">
            <StatusIndicator status={getNodeStatus(state)} />
          </div>
          <NodeCardTitle>{state}</NodeCardTitle>
          {nodeNotification ?? (
            <StakedNodeContributorList
              node={node}
              className={cn(
                state !== NODE_STATE.AWAITING_CONTRIBUTORS &&
                  state !== NODE_STATE.RUNNING &&
                  'hidden'
              )}
            />
          )}
        </label>
        <input type="checkbox" className="peer hidden appearance-none" id={id} />
        <label
          className="col-span-2 flex w-full cursor-pointer items-center justify-end align-middle peer-checked:hidden"
          htmlFor={id}
          aria-label="Expand"
          title="Expand"
        >
          <span className="hidden xl:block">Expand</span>
          <ArrowDownIcon className="ml-1 h-5 w-5" />
        </label>
        <label
          className="col-span-2 hidden w-full cursor-pointer items-center justify-end align-middle peer-checked:flex"
          htmlFor={id}
          aria-label="Collapse"
          title="Collapse"
        >
          <span className="hidden xl:block">Collapse</span>
          <ArrowDownIcon className="ml-1 h-5 w-5 rotate-180 transform" />
        </label>
        <div className="col-span-10 mt-3 hidden max-h-0 flex-col align-middle peer-checked:flex peer-checked:max-h-max">
          <div className="mb-2 flex flex-col text-xs opacity-40">
            <span className="font-bold">Last Reward Height: {lastRewardHeight}</span>
            <span className="font-bold">
              Last Uptime: {formatTimeDistanceToNowClient(lastUptime)}
            </span>
          </div>
        </div>
        <NodeCardText className="col-span-10 flex flex-row gap-1 peer-checked:[&>div>button]:block peer-checked:[&>div>div]:block peer-checked:[&>div>span]:hidden">
          <span className="font-bold">Public Key:</span> <NodePubKey pubKey={pubKey} />
        </NodeCardText>
        <div className="col-span-10 hidden max-h-0 flex-col align-middle peer-checked:flex peer-checked:max-h-max">
          <NodeCardText>
            <span className="font-bold">Balance:</span> {balance.toFixed(2)}
          </NodeCardText>
          <NodeCardText>
            <span className="font-bold">Operator Fee:</span> {(operatorFee * 100).toFixed(2)}%
          </NodeCardText>
        </div>
      </div>
    </NodeCard>
  );
});
StakedNodeCard.displayName = 'StakedNodeCard';

export { StakedNodeCard };
