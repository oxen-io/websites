'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';
import { cn } from '../../lib/utils';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();
  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className={cn(
        'toaster group mb-4 lg:me-8 lg:flex lg:items-center lg:justify-end',
        props.className
      )}
      toastOptions={{
        duration: Infinity,
        actionButtonStyle: {
          background: 'transparent',
          color: 'currentColor',
          fontWeight: 700,
          marginRight: '-1.5rem',
          textDecoration: 'underline',
        },
        cancelButtonStyle: {
          background: 'transparent',
          color: 'currentColor',
          fontWeight: 700,
          marginRight: '-1.5rem',
          textDecoration: 'underline',
        },
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-session-black group-[.toaster]:shadow-lg group-[.toaster]:font-atyp-display group-[.toaster]:text-[15px] group-[.toaster]:px-8 group-[.toaster]:py-5 group-[.toast-action]:bg-session-green',
          description: 'text-muted-foreground',
          icon: 'inline w-6 h-6 *:w-6 *:h-6',
          success: 'toast-success bg-session-black text-session-green border border-session-green',
          error: 'toast-error bg-session-black text-destructive border border-destructive',
          warning: 'toast-warning bg-session-black text-warning border border-warning',
          closeButton:
            'bg-session-black border-current group-hover:opacity-100 opacity-0 group-[.toast-success]:hover:bg-session-green group-[.toast-error]:hover:bg-destructive group-[.toast-warning]:hover:bg-warning group-[.toaster]:hover:text-session-black group-[.toaster]:hover:border-transparent',
        },
      }}
      position="bottom-right"
      closeButton={true}
      {...props}
    />
  );
};

export { Toaster };
