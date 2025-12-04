import type { SVGProps } from 'react'

export const VolumeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width={32}
    height={32}
    fill="none"
    {...props}>
    <path
      fill="currentColor"
      d="M4 12v8h5.333L16 26.667V5.333L9.333 12H4Zm9.333-.227v8.454l-2.893-2.894H6.667v-2.666h3.773l2.893-2.894ZM22 16a6 6 0 0 0-3.333-5.373V21.36A5.965 5.965 0 0 0 22 16ZM18.667 4.307v2.746C22.52 8.2 25.333 11.773 25.333 16c0 4.227-2.813 7.8-6.666 8.947v2.746C24.013 26.48 28 21.707 28 16S24.013 5.52 18.667 4.307Z"
    />
  </svg>
)
