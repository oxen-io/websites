import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
  noPadding?: boolean;
}

const Banner = forwardRef<HTMLDivElement, BannerProps>(({ className, children, ...props }, ref) => {
  return (
    <div
      className={cn(
        'bg-session-green text-session-black flex flex-wrap items-center justify-around p-2 text-sm',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Banner.displayName = 'Banner';

export { Banner };
