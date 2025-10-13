import type { SVGProps } from 'react'

export const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} fill="currentColor" viewBox="0 0 32 32" {...props}>
    <path
      fill="var(--color-text-secondary)"
      d="M30 0a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h28ZM15 9v6H9v2h6v6h2v-6h6v-2h-6V9h-2Z"
    />
  </svg>
)
