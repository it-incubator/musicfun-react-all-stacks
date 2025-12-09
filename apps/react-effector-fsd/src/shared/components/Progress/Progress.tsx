import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

import s from './Progress.module.css'

export type ProgressProps = {
  value: number
  max?: number
} & ComponentProps<'div'>

export const Progress = ({ value, max = 100, className, ...props }: ProgressProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div
      className={clsx(s.progress, className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      {...props}>
      <div className={s.progressBar} style={{ width: `${percentage}%` }} />
    </div>
  )
}
