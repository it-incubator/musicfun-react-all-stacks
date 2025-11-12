import type { SVGProps } from 'react'

export const PauseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    width={40}
    height={40}
    fill="none"
    {...props}>
    <path
      fill="#fff"
      d="M20 0c11.046 0 20 8.954 20 20s-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0Zm-6 11a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V12a1 1 0 0 0-1-1h-3Zm9 0a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V12a1 1 0 0 0-1-1h-3Z"
    />
  </svg>
)
