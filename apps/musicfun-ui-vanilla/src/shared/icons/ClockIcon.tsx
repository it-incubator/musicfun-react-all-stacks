import type { SVGProps } from 'react'

export const ClockIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={28}
    viewBox="0 0 28 28"
    fill="none"
    {...props}>
    <g clipPath="url(#a)">
      <path
        fill="currentColor"
        d="M14 3c6.075 0 11 4.925 11 11s-4.925 11-11 11S3 20.075 3 14 7.925 3 14 3Zm0 2a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm.5 8.5H18v2h-5.5v-7h2v5Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="currentColor" d="M0 0h28v28H0z" />
      </clipPath>
    </defs>
  </svg>
)
