import { clsx } from 'clsx'
import type { ComponentProps, ElementType } from 'react'

import s from './Tag.module.css'

export type HashtagProps<T extends ElementType = 'button'> = {
  as?: T
  active?: boolean
  tag: string
  className?: string
} & ComponentProps<T>

export const Tag = <T extends ElementType = 'button'>({
  as: Component = 'button',
  active = false,
  tag,
  className,
  ...props
}: HashtagProps<T>) => {
  const classNames = clsx(s.hashtag, active && s.active, className)

  return (
    <Component className={classNames} {...props}>
      #{tag}
    </Component>
  )
}
