import { type SVGProps } from 'react'

export const IconOneRepeat = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 23 23" {...props}>
      <rect width="24" height="24" fill="none" />
      <path
        fill="none"
        fillOpacity={0.7}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m16 4l3 3H5v3m3 10l-3-3h14v-3m-9-2.5l2-1.5v4"
      />
    </svg>
  )
}
