import type { SVGProps } from 'react'

export const LikeInSquareIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="currentColor"
    viewBox="0 0 32 32"
    {...props}>
    <rect width={32} height={32} fill="url(#a)" rx={2} />
    <path
      fill="#fff"
      d="M16 10.158c1.645-1.597 4.186-1.544 5.77.173 1.583 1.717 1.638 4.453.165 6.237L16 23l-5.934-6.432c-1.473-1.784-1.418-4.524.165-6.237 1.585-1.715 4.121-1.773 5.77-.173Z"
    />
    <defs>
      <linearGradient id="a" x1={1} x2={32} y1={1} y2={30.5} gradientUnits="userSpaceOnUse">
        <stop stopColor="#3822EA" />
        <stop offset={1} stopColor="#C7E9D7" />
      </linearGradient>
    </defs>
  </svg>
)
