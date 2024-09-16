import { forwardRef, type HTMLAttributes, useMemo } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { Circle } from './shapes/circle';
import { cn } from '../../lib/utils';

export enum PROGRESS_STATUS {
  IDLE,
  PENDING,
  SUCCESS,
  ERROR,
}

type Step = {
  text: Partial<Record<PROGRESS_STATUS, string>> & { [PROGRESS_STATUS.IDLE]: string };
  status: PROGRESS_STATUS;
};

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  steps: Array<Step>;
}

const variants = {
  idle: { opacity: 0, pathLength: 0 },
  pending: { opacity: 1, pathLength: 0.5 },
  error: { opacity: 1, pathLength: 0.5 },
  success: { opacity: 1, pathLength: 1 },
};

const circleVariants = {
  idle: { scale: 0.75 },
  pending: { scale: 1 },
  error: { scale: 1 },
  success: { scale: 1 },
};

function ProgressStep({
  isFirst,
  isLast,
  circleRadius,
  text,
  status,
}: {
  isFirst: boolean;
  isLast: boolean;
  status: PROGRESS_STATUS;
  circleRadius: number;
  text: Partial<Record<PROGRESS_STATUS, string>> & { [PROGRESS_STATUS.IDLE]: string };
}) {
  const circleVariant = useMemo(() => {
    switch (status) {
      case PROGRESS_STATUS.IDLE:
        return 'grey' as const;
      case PROGRESS_STATUS.PENDING:
        return 'blue' as const;
      case PROGRESS_STATUS.SUCCESS:
        return 'green' as const;
      case PROGRESS_STATUS.ERROR:
        return 'red' as const;
    }
  }, [status]);

  const statusText = useMemo(() => {
    switch (status) {
      case PROGRESS_STATUS.IDLE:
        return 'idle';
      case PROGRESS_STATUS.PENDING:
        return 'pending';
      case PROGRESS_STATUS.SUCCESS:
        return 'success';
      case PROGRESS_STATUS.ERROR:
        return 'error';
    }
  }, [status]);

  const height = circleRadius * 7;
  const width = circleRadius * 7;
  const x1 = width / 2;

  return (
    <div className={cn('relative -ml-4 w-full')} style={{ height }}>
      <svg
        height={height + 1}
        width={height}
        xmlns="http://www.w3.org/2000/svg"
        className="absolute"
      >
        <line
          x1={x1}
          x2={x1}
          y1={isFirst ? '50%' : '0%'}
          y2={isLast ? '50%' : '100%'}
          strokeWidth={2}
          strokeDasharray={height / 20}
          className="stroke-session-text"
        />
        <motion.line
          x1={x1}
          x2={x1}
          y1={isFirst ? '50%' : '0'}
          y2={isLast ? '50%' : '100%'}
          strokeWidth={2.5}
          className="stroke-session-white"
          variants={variants}
          animate={statusText}
        />
      </svg>
      <svg height={height} width={width} xmlns="http://www.w3.org/2000/svg" className="absolute">
        <Circle
          cx="50%"
          cy="50%"
          r={circleRadius + 2.5}
          variant={circleVariant}
          variants={circleVariants}
          glow={circleVariant}
          animate={statusText}
        />
      </svg>
      <svg
        height={height}
        width={width}
        xmlns="http://www.w3.org/2000/svg"
        className={cn('absolute', status === PROGRESS_STATUS.PENDING && 'animate-spin')}
      >
        <Circle
          cx="50%"
          cy="50%"
          r={circleRadius}
          strokeWidth={1.5}
          variant={circleVariant}
          partial={status === PROGRESS_STATUS.PENDING ? '25' : '100'}
        />
      </svg>
      <span
        style={{ marginLeft: width }}
        className="mt-0.5 flex h-full items-center text-start align-middle leading-tight"
      >
        {text[status] ?? text[PROGRESS_STATUS.IDLE]}
      </span>
    </div>
  );
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ steps, className, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx('flex w-full flex-col items-start', className)} {...props}>
        {steps.map(({ text, status }, i) => (
          <ProgressStep
            key={i}
            circleRadius={8}
            isFirst={i === 0}
            isLast={i === steps.length - 1}
            status={status}
            text={text}
          />
        ))}
      </div>
    );
  }
);
Progress.displayName = 'Progress';
