import { forwardRef } from 'react';
import { SVGAttributes } from './types';

export const FlagOfSwitzerlandIcon = forwardRef<SVGSVGElement, SVGAttributes>((props, ref) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" {...props} ref={ref}>
    <g clipPath="url(#a)">
      <path fill="#DA291C" d="M.55.28h21v21h-21v-21Z" />
      <path fill="#fff" d="M9.08 4.22H13v4.6h4.6v3.93H13v4.6H9.08v-4.6h-4.6V8.81h4.6v-4.6Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h21v21H0z" transform="translate(.55 .28)" />
      </clipPath>
    </defs>
  </svg>
));
