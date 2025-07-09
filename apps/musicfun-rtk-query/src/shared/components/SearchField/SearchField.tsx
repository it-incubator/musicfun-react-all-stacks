import { clsx } from 'clsx'
import type { ComponentProps, ReactNode } from 'react'

import { SearchIcon } from '@/shared/icons'

import s from './SearchField.module.css'

export type SearchFieldProps = {
  label?: ReactNode
  placeholder?: string
} & ComponentProps<'input'>

export const SearchField = ({
  className,
  placeholder = 'Search...',
  ...props
}: SearchFieldProps) => {
  return (
    <div className={clsx(s.inputWrapper, className)}>
      <SearchIcon className={s.searchIcon} />
      <input className={clsx(s.input)} type="text" placeholder={placeholder} {...props} />
    </div>
  )
}
