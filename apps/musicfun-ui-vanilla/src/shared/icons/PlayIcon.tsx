import type { SVGProps } from 'react'

export const PlayIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={72}
    height={72}
    viewBox="0 0 72 72"
    fill="none"
    {...props}>
    <circle cx={36} cy={36} r={36} fill="#FF38B6" />
    <path
      fill="#000"
      d="M49.287 36.512c.865-.486.865-1.7 0-2.186l-19.47-10.93c-.864-.485-1.946.122-1.946 1.093v21.86c0 .971 1.082 1.579 1.947 1.093l19.469-10.93Z"
    />
  </svg>
)
