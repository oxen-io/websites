import { formatTimeDistanceToNowClient } from '@/lib/locale-client';
import { NODE_STATE } from '@session/sent-staking-js';
import { StatusIndicator, statusVariants } from '@session/ui/components/StatusIndicator';
import { Loading } from '@session/ui/components/loading';
import ArrowDown from '@session/ui/icons/ArrowDown';
import HumanIcon from '@session/ui/icons/Human';
import { cn } from '@session/ui/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, useId, useMemo, type HTMLAttributes } from 'react';

export const NODE_STATE_VALUES = Object.values(NODE_STATE);

interface Contributor {
  address: string;
  amount: number;
}

export interface GenericSessionNode {
  state: NODE_STATE;
  contributors: Contributor[];
  lastRewardHeight: number;
  lastUptime: Date;
  pubKey: string;
  balance: number;
  operatorFee: number;
  operator_address: string;
}

type RunningSessionNode = GenericSessionNode & {
  state: NODE_STATE.RUNNING;
  deregistrationDate?: Date;
};

type AwaitingContributorsSessionNode = GenericSessionNode & {
  state: NODE_STATE.AWAITING_CONTRIBUTORS;
};

type CancelledSessionNode = GenericSessionNode & { state: NODE_STATE.CANCELLED };

type DecommissionedSessionNode = GenericSessionNode & {
  state: NODE_STATE.DECOMMISSIONED;
  deregistrationDate: Date;
};

type DeregisteredSessionNode = GenericSessionNode & {
  state: NODE_STATE.DEREGISTERED;
  requiresLiquidation?: boolean;
};

type VoluntaryDeregistrationSessionNode = GenericSessionNode & {
  state: NODE_STATE.VOLUNTARY_DEREGISTRATION;
};

export type SessionNode =
  | RunningSessionNode
  | AwaitingContributorsSessionNode
  | CancelledSessionNode
  | DecommissionedSessionNode
  | DeregisteredSessionNode
  | VoluntaryDeregistrationSessionNode;

/** Type assertions */
const isRunning = (node: SessionNode): node is RunningSessionNode =>
  node.state === NODE_STATE.RUNNING;

const isAwaitingContributors = (node: SessionNode): node is AwaitingContributorsSessionNode =>
  node.state === NODE_STATE.AWAITING_CONTRIBUTORS;

const isCancelled = (node: SessionNode): node is CancelledSessionNode =>
  node.state === NODE_STATE.CANCELLED;

const isDecommissioned = (node: SessionNode): node is DecommissionedSessionNode =>
  node.state === NODE_STATE.DECOMMISSIONED;

const isDeregistered = (node: SessionNode): node is DeregisteredSessionNode =>
  node.state === NODE_STATE.DEREGISTERED;

const isVoluntaryDeregistration = (node: SessionNode): node is VoluntaryDeregistrationSessionNode =>
  node.state === NODE_STATE.VOLUNTARY_DEREGISTRATION;

/** State assertions */

/**
 * Checks if a node is being deregistered.
 * @param node - The node to check.
 * @returns `true` if the node is being deregistered, `false` otherwise.
 */
const isBeingDeregistered = (
  node: SessionNode
): node is (RunningSessionNode | DecommissionedSessionNode) & { deregistrationDate: Date } =>
  'deregistrationDate' in node && node.deregistrationDate !== undefined;

/**
 * Checks if a given node is awaiting liquidation.
 * @param node - The deregistered session node to check.
 * @returns A boolean indicating whether the node requires liquidation.
 */
const isAwaitingLiquidation = (node: SessionNode): boolean =>
  'requiresLiquidation' in node && node.requiresLiquidation === true;

/**
 * Checks if a given node is operated by a specific operator.
 * @param node - The session node to check.
 * @param operatorAddress - The address of the operator to compare with.
 * @returns `true` if the node is operated by the specified operator, `false` otherwise.
 */
const isNodeOperator = (node: SessionNode, operatorAddress: string): boolean =>
  node.operator_address === operatorAddress;

/**
 * Checks if a given contributor address is a contributor of a session node.
 *
 * @param node - The session node to check.
 * @param contributorAddress - The address of the contributor to check.
 * @returns `true` if the contributor address is a contributor of the session node, `false` otherwise.
 */
const isNodeContributor = (node: SessionNode, contributorAddress: string): boolean =>
  node.contributors.some(({ address }) => address === contributorAddress);

export const outerCardVariants = cva(
  'rounded-[20px] hover:cursor-pointer transition-all ease-in-out bg-gradient-to-br from-[#7FB1AE] to-[#2A4337] bg-blend-lighten shadow-md p-px',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const cardVariants = cva(
  'rounded-[20px] w-full h-full flex align-middle flex-col p-8 from-[#090F0D] to-[#081310] bg-gradient-to-br',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface StakeCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  loading?: boolean;
}

const StakeCard = forwardRef<HTMLDivElement, StakeCardProps>(
  ({ className, variant, loading, children, ...props }, ref) => {
    return (
      <div className={cn(outerCardVariants({ variant, className }))}>
        <div className={cn(cardVariants({ variant, className }))} ref={ref} {...props}>
          {loading ? <Loading /> : children}
        </div>
      </div>
    );
  }
);

StakeCard.displayName = 'StakeCard';

const cardHeaderVariants = cva('w-full flex flex-row', {
  variants: {
    variant: {
      default: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface StakeCardHeaderProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {
  loading?: boolean;
}

const NodeCardHeader = forwardRef<HTMLDivElement, StakeCardHeaderProps>(
  ({ className, variant, loading, children, ...props }, ref) => {
    return (
      <div className={cn(cardHeaderVariants({ variant, className }))} ref={ref} {...props}>
        {loading ? <Loading /> : children}
      </div>
    );
  }
);
NodeCardHeader.displayName = 'NodeCardHeader';

const NodeCardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn(
        'leading-none font-normal text-xl md:text-3xl font-atyp-display from-[#FFFFFF] to-[#B3CBC5] bg-gradient-to-br bg-clip-text text-transparent',
        className
      )}
      {...props}
    />
  )
);
NodeCardTitle.displayName = 'NodeCardTitle';

const NodeCardText = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'text-base font-extralight md:text-lg font-atyp-display from-[#FFFFFF] to-[#79A499] bg-gradient-to-br bg-clip-text text-transparent',
        className
      )}
      {...props}
    />
  )
);
NodeCardText.displayName = 'NodeCardText';

function getStatus(state: NODE_STATE): VariantProps<typeof statusVariants>['status'] {
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

const PubKey = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { pubKey: string }>(
  ({ className, pubKey, ...props }, ref) => {
    const [pubKeyStart, pubKeyEnd] = useMemo(() => {
      const start = pubKey.slice(0, 6);
      const end = pubKey.slice(pubKey.length - 6);
      return [start, end];
    }, [pubKey]);

    return (
      <div ref={ref} className={cn('group flex select-all', className)} {...props}>
        <span className="group-hover:hidden select-all">
          {pubKeyStart}...{pubKeyEnd}
        </span>
        <div className="group-hover:block hidden select-all break-all">
          <span>{pubKey}</span>
        </div>
        {/*         <button
          onClick={() => void navigator.clipboard.writeText(pubKey)}
          className="group-hover:block hidden select-all"
        >
        </button> */}
      </div>
    );
  }
);
PubKey.displayName = 'PubKey';

const NodeContributorList = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { node: Pick<SessionNode, 'contributors' | 'state'> }
>(({ className, node: { contributors, state }, ...props }, ref) => {
  return (
    <div
      className={cn('gap-1 align-baseline self-baseline flex flex-row -mb-0.5', className)}
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
      <span className={'text-xl block xl:hidden'}>
        {contributors.length}
        {state === NODE_STATE.AWAITING_CONTRIBUTORS ? '/10' : null}
      </span>
    </div>
  );
});

const StakeCardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { node: SessionNode }
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
    <div className={cn('grid grid-cols-10', className)} ref={ref} {...props}>
      <label
        className="w-full col-span-8 flex align-middle items-baseline gap-4 cursor-pointer"
        htmlFor={id}
        aria-label="Toggle details expansion"
        title="Toggle details expansion"
      >
        <div className="p-0.5">
          <StatusIndicator status={getStatus(state)} />k
        </div>
        <NodeCardTitle>{state}</NodeCardTitle>
        {nodeNotification ?? (
          <NodeContributorList
            node={node}
            className={cn(
              state !== NODE_STATE.AWAITING_CONTRIBUTORS && state !== NODE_STATE.RUNNING && 'hidden'
            )}
          />
        )}
      </label>
      <input type="checkbox" className="peer appearance-none hidden" id={id} />
      <label
        className="peer-checked:hidden flex justify-end col-span-2 cursor-pointer w-full align-middle items-center"
        htmlFor={id}
        aria-label="Expand"
        title="Expand"
      >
        <span className="xl:block hidden">Expand</span>
        <ArrowDown className="ml-1 h-5 w-5" />
      </label>
      <label
        className="peer-checked:flex justify-end hidden col-span-2 cursor-pointer w-full align-middle items-center"
        htmlFor={id}
        aria-label="Collapse"
        title="Collapse"
      >
        <span className="xl:block hidden">Collapse</span>
        <ArrowDown className="ml-1 h-5 w-5 transform rotate-180" />
      </label>
      <div className="mt-3 align-middle flex-col peer-checked:max-h-max max-h-0 peer-checked:flex hidden col-span-10">
        <div className="flex flex-col text-xs opacity-40 mb-2">
          <span className="font-bold">Last Reward Height: {lastRewardHeight}</span>
          <span className="font-bold">
            Last Uptime: {formatTimeDistanceToNowClient(lastUptime)}
          </span>
        </div>
      </div>
      <NodeCardText className="col-span-10 flex flex-row gap-1 peer-checked:[&>div>div]:block peer-checked:[&>div>button]:block peer-checked:[&>div>span]:hidden">
        <span className="font-bold">Public Key:</span> <PubKey pubKey={pubKey} />
      </NodeCardText>
      <div className="align-middle flex-col peer-checked:max-h-max max-h-0 peer-checked:flex hidden col-span-10">
        <NodeCardText>
          <span className="font-bold">Balance:</span> {balance.toFixed(2)}
        </NodeCardText>
        <NodeCardText>
          <span className="font-bold">Operator Fee:</span> {(operatorFee * 100).toFixed(2)}%
        </NodeCardText>
      </div>
    </div>
  );
});
StakeCardContent.displayName = 'StakeCardContent';

export {
  StakeCard,
  StakeCardContent,
  NodeCardHeader as StakeCardHeader,
  NodeCardText as StakeCardText,
  NodeCardTitle as StakeCardTitle,
  cardVariants as StakeCardVariants,
};
