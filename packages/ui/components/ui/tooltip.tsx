'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';

import { cn } from '../../lib/utils';

const Tooltip = PopoverPrimitive.Root;

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Trigger ref={ref} className={cn('cursor-pointer', className)} {...props} />
));

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    side="top"
    className={cn(
      'text-session-white animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 bg-session-black border-px z-50 overflow-hidden rounded-full border border-[#1C2624] bg-opacity-50 px-4 py-2 text-sm shadow-xl outline-none',
      className
    )}
    {...props}
  ></PopoverPrimitive.Content>
));
TooltipContent.displayName = PopoverPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipTrigger };
