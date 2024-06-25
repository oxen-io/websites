import { forwardRef } from 'react';
import { SVGAttributes } from './types';

export const HamburgerIcon = forwardRef<SVGSVGElement, SVGAttributes>((props, ref) => (
  <svg
    width="58"
    height="57"
    viewBox="0 0 58 57"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    ref={ref}
  >
    <path id="Vector 7" d="M17.9453 20.163H39.945" stroke-width="1.70722" />
    <path id="Vector 8" d="M17.9453 28.6488H39.945" stroke-width="1.70722" />
    <path id="Vector 9" d="M17.9453 36.6624H39.945" stroke-width="1.70722" />
  </svg>
));
