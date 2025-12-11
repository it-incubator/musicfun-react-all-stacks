import type { SVGProps } from 'react'

import s from './LiveWaveIcon.module.css'

export const LiveWaveIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}>
    <rect
      x={2}
      y={8}
      width={2}
      height={8}
      rx={1}
      fill="currentColor"
      className={s.bar}
      style={{ animationDelay: '0ms' }}
    />
    <rect
      x={6}
      y={4}
      width={2}
      height={16}
      rx={1}
      fill="currentColor"
      className={s.bar}
      style={{ animationDelay: '150ms' }}
    />
    <rect
      x={10}
      y={6}
      width={2}
      height={12}
      rx={1}
      fill="currentColor"
      className={s.bar}
      style={{ animationDelay: '300ms' }}
    />
    <rect
      x={14}
      y={2}
      width={2}
      height={20}
      rx={1}
      fill="currentColor"
      className={s.bar}
      style={{ animationDelay: '450ms' }}
    />
  </svg>
)
