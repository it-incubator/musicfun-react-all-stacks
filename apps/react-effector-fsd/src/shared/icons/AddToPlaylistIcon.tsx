import type { SVGProps } from 'react'

export const AddToPlaylistIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <circle cx={7.891} cy={7} r={5.5} fill="currentColor" />
    <circle cx={7.891} cy={7} r={5.5} fill="currentColor" />
    <path fill="#000" d="M8.134 4.795v2.456h2.34v.776h-2.34V10.5h-.84V8.026H4.966v-.776h2.328V4.795h.84Z" />
    <path
      fill="#fff"
      d="M5.89 16.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0 1.167a2.333 2.333 0 1 0 0 4.665 2.333 2.333 0 0 0 0-4.665ZM17.89 14.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0 1.167a2.333 2.333 0 1 0 0 4.666 2.333 2.333 0 0 0 0-4.666ZM10.902 5.9l10.489-1.998v1l-10.5 2 .011-1.003Z"
    />
    <path fill="#fff" d="M8.39 11.5h1v8l-1-.533V11.5ZM20.39 4.964l1-.464v13l-1-.928V4.963Z" />
  </svg>
)
