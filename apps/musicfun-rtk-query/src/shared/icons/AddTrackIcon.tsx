import type { SVGProps } from 'react'

export const AddTrackIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    width={16}
    height={16}
    fill="none"
    {...props}>
    <circle cx={5.26} cy={4.667} r={3.667} fill="currentColor" />
    <circle cx={5.26} cy={4.667} r={3.667} fill="currentColor" />
    <path
      fill="#000"
      d="M6.99 5.018H5.424v1.649H4.87V5.018H3.313v-.517h1.556V2.864h.556V4.5H6.99v.517Z"
    />
    <path
      fill="currentColor"
      d="M3.927 11a2.334 2.334 0 1 1 0 4.668 2.334 2.334 0 0 1 0-4.668Zm0 .778a1.555 1.555 0 1 0 0 3.111 1.555 1.555 0 0 0 0-3.11ZM11.927 9.667a2.334 2.334 0 1 1 0 4.668 2.334 2.334 0 0 1 0-4.668Zm0 .777a1.556 1.556 0 1 0 .001 3.112 1.556 1.556 0 0 0 0-3.112ZM7.267 3.933l6.992-1.331v.666l-7 1.334.008-.669Z"
    />
    <path
      fill="currentColor"
      d="M5.594 7.667h.666V13l-.666-.355V7.667ZM13.594 3.31 14.26 3v8.667l-.666-.62V3.31Z"
    />
  </svg>
)
