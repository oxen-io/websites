import { forwardRef } from 'react';
import { SVGAttributes } from '../types';

export const XIcon = forwardRef<SVGSVGElement, SVGAttributes>((props, ref) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62 58" {...props} ref={ref}>
    <g clipPath="url(#clip0_79_29041)">
      <path d="M48.7734 0H58.28L37.4067 24.6125L61.7934 58H42.656L27.6727 37.7107L10.5194 58H1.01271L23.126 31.6753L-0.227295 0H19.3854L32.922 18.5343L48.7734 0ZM45.446 52.2214H50.716L16.616 5.56458H10.9534L45.446 52.2214Z"></path>
    </g>
    <defs>
      <clipPath id="clip0_79_29041">
        <rect fill="white" height="58" width="62"></rect>
      </clipPath>
    </defs>
  </svg>
));
