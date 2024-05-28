'use client';
import { QUERY_STATUS } from '@/providers/sent-staking-provider';
import { CONTRACT_READ_STATUS } from '@session/contracts/hooks/contract-hooks';
import { ModuleText } from '@session/ui/components/Module';
import { LoadingText } from '@session/ui/components/loading-text';
import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { toastErrorRefetch, type ToastErrorRefetchProps } from './Toast';

type GenericQueryProps = {
  fallback: ReactNode;
  errorToast: ToastErrorRefetchProps;
};

type ModuleContractReadTextProps = HTMLAttributes<HTMLSpanElement> & {
  status: CONTRACT_READ_STATUS;
} & GenericQueryProps;

const ModuleContractReadText = forwardRef<HTMLSpanElement, ModuleContractReadTextProps>(
  ({ className, children, status, fallback, errorToast, ...props }, ref) => {
    const toastId = useId();
    if (status === CONTRACT_READ_STATUS.ERROR) {
      toastErrorRefetch({
        ...errorToast,
        toastId,
      });
    }
    return (
      <ModuleText ref={ref} className={className} {...props}>
        {status === CONTRACT_READ_STATUS.SUCCESS ? (
          children ?? fallback
        ) : status === CONTRACT_READ_STATUS.ERROR ? (
          fallback
        ) : (
          <LoadingText />
        )}
      </ModuleText>
    );
  }
);
ModuleContractReadText.displayName = 'ModuleContractReadText';

type ModuleQueryTextProps = HTMLAttributes<HTMLSpanElement> & {
  status: QUERY_STATUS;
} & GenericQueryProps;

const ModuleQueryText = forwardRef<HTMLSpanElement, ModuleQueryTextProps>(
  ({ className, children, status, fallback, errorToast, ...props }, ref) => {
    const toastId = useId();
    if (status === QUERY_STATUS.ERROR) {
      toastErrorRefetch({
        ...errorToast,
        toastId,
      });
    }
    return (
      <ModuleText ref={ref} className={className} {...props}>
        {status === QUERY_STATUS.SUCCESS ? (
          children ?? fallback
        ) : status === QUERY_STATUS.ERROR ? (
          fallback
        ) : (
          <LoadingText />
        )}
      </ModuleText>
    );
  }
);
ModuleQueryText.displayName = 'ModuleQueryText';

export { ModuleContractReadText, ModuleQueryText };
