import { forwardRef } from 'react';
import { SVGAttributes } from './types';

export const HamburgerIcon = forwardRef<SVGSVGElement, SVGAttributes>((props, ref) => (
  <svg
    width="58"
    height="57"
    viewBox="0 0 58 57"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    ref={ref}
  >
    <path d="M18 20H40" strokeWidth="2" />
    <path d="M18 28.5H40" strokeWidth="2" />
    <path d="M18 36.5H40" strokeWidth="2" />
  </svg>
));
