import type { SVGProps } from 'react'

export const LikeIconFill = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 28" width={29} height={28} fill="none" {...props}>
    <g clipPath="url(#a)">
      <path
        fill="currentColor"
        d="M14.4 6.04a6.137 6.137 0 0 1 8.655.248c2.375 2.47 2.457 6.402.247 8.967L14.4 24.5l-8.902-9.245c-2.21-2.566-2.126-6.504.248-8.967C8.123 3.823 11.927 3.74 14.4 6.04Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="currentColor" d="M.4 0h28v28H.4z" />
      </clipPath>
    </defs>
  </svg>
)
