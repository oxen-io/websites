'use client';

import { ModuleText } from '@session/ui/components/Module';
import { LoadingText } from '@session/ui/components/loading-text';
import { forwardRef, type HTMLAttributes, type ReactNode, useId } from 'react';
import { toastErrorRefetch, type ToastErrorRefetchProps } from './Toast';
import { QUERY_STATUS } from '@/lib/query';
import type { GenericContractStatus } from '@session/contracts/hooks/useContractWriteQuery';

type GenericQueryProps = {
  fallback: ReactNode;
  errorToast: ToastErrorRefetchProps;
};

type ModuleContractReadTextProps = HTMLAttributes<HTMLSpanElement> & {
  status: GenericContractStatus;
} & GenericQueryProps;

const ModuleDynamicContractReadText = forwardRef<HTMLSpanElement, ModuleContractReadTextProps>(
  ({ className, children, status, fallback, errorToast, ...props }, ref) => {
    const toastId = useId();

    if (status === 'error') {
      toastErrorRefetch({
        ...errorToast,
        toastId,
      });
    }
    return (
      <ModuleText ref={ref} className={className} {...props}>
        {status === 'success' ? (
          children ?? fallback
        ) : status === 'error' ? (
          fallback
        ) : (
          <LoadingText />
        )}
      </ModuleText>
    );
  }
);
ModuleDynamicContractReadText.displayName = 'ModuleDynamicContractReadText';

type ModuleQueryTextProps = HTMLAttributes<HTMLSpanElement> & {
  status: QUERY_STATUS;
} & GenericQueryProps;

const ModuleDynamicQueryText = forwardRef<HTMLSpanElement, ModuleQueryTextProps>(
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
ModuleDynamicQueryText.displayName = 'ModuleDynamicQueryText';

export { ModuleDynamicContractReadText, ModuleDynamicQueryText };
