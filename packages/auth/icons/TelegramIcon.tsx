import type { SVGAttributes } from '@session/ui/icons/types';
import { forwardRef } from 'react';

export const TelegramIcon = forwardRef<SVGSVGElement, SVGAttributes>((props, ref) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 35 28" {...props} ref={ref}>
    <path
      fill="#000"
      fillRule="evenodd"
      d="M26.45 27.58a1.63 1.63 0 0 0 2.54-.96c1.2-5.67 4.13-20 5.23-25.16A1.1 1.1 0 0 0 32.76.21C26.93 2.38 9.02 9.1 1.7 11.8c-.47.17-.77.62-.76 1.1.02.5.35.92.83 1.07 3.28.98 7.59 2.34 7.59 2.34s2.01 6.09 3.06 9.18a1.2 1.2 0 0 0 1.96.51l4.3-4.05s4.95 3.63 7.76 5.63ZM11.18 15.55l2.33 7.68.52-4.87L28.15 5.62a.38.38 0 0 0 .05-.52.4.4 0 0 0-.52-.09l-16.5 10.54Z"
      clipRule="evenodd"
    />
  </svg>
));
