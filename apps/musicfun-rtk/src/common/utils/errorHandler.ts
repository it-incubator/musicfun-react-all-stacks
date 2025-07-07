import type { FieldValues, UseFormSetError, Path } from 'react-hook-form'
import type { ExtensionsError } from '../types'

export const errorHandler = <T extends FieldValues>(e: unknown, setError: UseFormSetError<T>) => {
  const error = e as ExtensionsError

  const key = error?.data?.extensions?.[0]?.key

  const message = error?.data?.extensions?.[0]?.message
  if (key) {
    setError(key as Path<T>, {
      type: 'manual',
      message,
    })
  }
}
