import clsx from 'clsx'
import type { ComponentProps, ElementType } from 'react'
import React from 'react'

import styles from './Typography.module.css'

const VARIANT_DEFAULT_COMPONENT: Record<string, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body1: 'p',
  body2: 'p',
  body3: 'p',
  caption: 'span',
  label: 'label',
}

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'caption'
  | 'label'
  | 'error'

type Props<T extends ElementType> = {
  variant?: TypographyVariant
  as?: T
  children: React.ReactNode
} & ComponentProps<T>

export const Typography = <T extends ElementType = 'span'>({
  variant = 'body1',
  as,
  children,
  className = '',
  ...props
}: Props<T>) => {
  const Component = as || VARIANT_DEFAULT_COMPONENT[variant] || 'span'
  const variantClass = styles[variant] || ''

  return (
    <Component className={clsx(variantClass, className)} {...props}>
      {children}
    </Component>
  )
}
