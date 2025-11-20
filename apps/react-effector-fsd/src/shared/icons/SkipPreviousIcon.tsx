import type { SVGProps } from 'react'

export const SkipPreviousIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={32} height={32} fill="none" {...props}>
    <path
      fill="currentColor"
      fillOpacity={0.7}
      d="M8 8h2.667v16H8V8Zm4.667 8L24 24V8l-11.333 8Zm8.666 2.853L17.293 16l4.04-2.853v5.706Z"
    />
  </svg>
)
