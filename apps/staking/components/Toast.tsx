import { toast } from '@session/ui/lib/toast';
import { useId } from 'react';

export type ToastErrorRefetchProps = {
  messages: {
    error: string;
    refetching: string;
    success: string;
  };
  refetch: () => Promise<unknown>;
  toastId?: string;
};

export const toastErrorRefetch = ({
  messages: { error, refetching, success },
  refetch,
  toastId,
}: ToastErrorRefetchProps) => {
  const id = toastId ?? useId();
  toast.error(error, {
    id,
    action: {
      label: 'Refetch',
      onClick: (event) => {
        event.preventDefault();
        toast.promise(refetch(), {
          id,
          loading: refetching,
          success,
        });
      },
    },
  });
};
