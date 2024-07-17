import { cva, type VariantProps } from 'class-variance-authority';
import { type HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

export const statusVariants = cva('w-3 h-3 rounded-full filter drop-shadow-lg', {
  variants: {
    status: {
      green: 'bg-[#00F782] drop-shadow-[0_0_8px_#00F782] glow',
      blue: 'bg-[#00A3F7] drop-shadow-[0_0_8px_#00A3F7] glow-blue',
      yellow: 'bg-[#F7DE00] drop-shadow-[0_0_8px_#F7DE00] glow-yellow',
      red: 'bg-red-500 drop-shadow-[0_0_8px_F70000] glow-red',
      grey: 'bg-[#4A4A4A] drop-shadow-[0_0_8px_#4A4A4A] glow-grey',
      pending:
        'border-[#4A4A4A] border-t-[#00A3F7] drop-shadow-[0_0_8px_#00A3F7] glow-blue animate-spin rounded-full border-4 drop-shadow-[0_0_8px_#00A3F7]',
    },
  },
});

export const StatusIndicator = ({
  className,
  status,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof statusVariants>) => (
  <div className={cn(statusVariants({ status, className }))} {...props} />
);
