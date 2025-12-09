import { clsx } from 'clsx'
import type { ComponentProps, CSSProperties } from 'react'

import s from './Skeleton.module.css'

export type SkeletonProps = {
  circle?: boolean
  width?: number | string
  height?: number | string
  className?: string
  style?: CSSProperties
} & ComponentProps<'div'>

export const Skeleton = ({
  circle = false,
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) => {
  return (
    <div
      className={clsx(s.skeleton, circle && s.circle, className)}
      style={{ width, height, ...style }}
      {...props}
    />
  )
}
