import type { SVGProps } from 'react'

export const UploadIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width={32}
    height={32}
    fill="none"
    {...props}>
    <path
      fill="currentColor"
      d="M24 20v4H8v-4H5.333v4c0 1.467 1.2 2.667 2.667 2.667h16c1.467 0 2.667-1.2 2.667-2.667v-4H24ZM9.333 12l1.88 1.88 3.454-3.44v10.894h2.666V10.44l3.454 3.44 1.88-1.88L16 5.333 9.333 12Z"
    />
  </svg>
)
