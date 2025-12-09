import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

import s from './Loader.module.css'
export type LoaderProps = ComponentProps<'progress'>

export const Loader = ({ className, ...restProps }: LoaderProps) => {
  return <progress className={clsx(s.root, className)} {...restProps} />
}
