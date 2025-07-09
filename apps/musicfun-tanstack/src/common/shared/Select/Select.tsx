import { clsx } from 'clsx'

import { ArrowDownIcon } from '@/common/icons'
import { useGetId } from '@/common/hooks'

import { Typography } from '../Typography'
import s from './Select.module.css'
import type { SelectProps } from './Select.types.ts'

export const Select = ({ className, errorMessage, id, label, options, placeholder, ...props }: SelectProps) => {
  const showError = Boolean(errorMessage)
  const selectId = useGetId(id)

  return (
    <div className={clsx(s.container, className)}>
      {label && (
        <Typography variant="label" as="label" htmlFor={selectId} className={clsx(s.label, showError && s.error)}>
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
