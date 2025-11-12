import { clsx } from 'clsx'
import type { ComponentProps, ReactNode } from 'react'

import { ArrowDownIcon } from '@/shared/icons'

import { useGetId } from '../../hooks/useGetId'
import { Typography } from '../Typography'
import s from './Select.module.css'

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

export type SelectProps = {
  label?: ReactNode
  errorMessage?: string
  options: SelectOption[]
  placeholder?: string
} & ComponentProps<'select'>

export const Select = ({ className, errorMessage, id, label, options, placeholder, ...props }: SelectProps) => {
  const showError = Boolean(errorMessage)
  const selectId = useGetId(id)

  return (
    <div className={clsx(s.container, className)}>
      {label && (
        <Typography variant="label" as="label" htmlFor={selectId}>
          {label}
        </Typography>
      )}

      <div className={s.selectWrapper}>
        <select className={clsx(s.select, showError && s.error)} id={selectId} {...props}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <ArrowDownIcon className={s.icon} />
      </div>

      {showError && <Typography variant="error">{errorMessage}</Typography>}
    </div>
  )
}
