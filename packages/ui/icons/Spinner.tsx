import { Loader } from 'lucide-react';
import { forwardRef } from 'react';
import { type SVGAttributes } from './types';
import { cn } from '../lib/utils';

export const Spinner = forwardRef<SVGSVGElement, SVGAttributes>(({ className, ...props }, ref) => (
  <Loader className={cn('animate-spin', className)} {...props} ref={ref} />
));
