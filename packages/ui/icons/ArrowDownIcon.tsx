import { forwardRef } from 'react';
import { SVGAttributes } from './types';

export const ArrowDownIcon = forwardRef<SVGSVGElement, SVGAttributes>((props, ref) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 15" {...props} ref={ref}>
    <path d="M1.14.4a1 1 0 0 0-.71 1.7l12.44 12.45a1 1 0 0 0 1.42 0L26.73 2.11a1 1 0 0 0-.7-1.7H1.13Z" />
  </svg>
));
