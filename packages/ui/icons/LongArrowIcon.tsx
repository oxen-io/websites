import { forwardRef } from 'react';
import { SVGAttributes } from './types';

export const LongArrowIcon = forwardRef<SVGSVGElement, SVGAttributes>((props, ref) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 37 4" {...props} ref={ref}>
    <path fill="inherit" d="M36.3 2.06 33.19.27v3.59l3.1-1.8Zm-2.8-.3H.17v.62H33.5v-.63Z" />
  </svg>
));
