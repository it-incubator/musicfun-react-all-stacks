import type { ComponentProps, ReactNode } from 'react'

type SelectOption = {
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
