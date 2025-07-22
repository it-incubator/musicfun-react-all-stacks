import { type FetchBaseQueryError, type FetchBaseQueryMeta, type QueryReturnValue } from '@reduxjs/toolkit/query'
import { showErrorToast } from '@/common/utils'
import type { ExtensionsError } from '@/common/types'

export const handleError = (result: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>) => {
  if (!result.error) return

  const error = result.error

  const extensionsError = (error as ExtensionsError)?.data?.extensions
  if (error.status === 401 || extensionsError?.length) return

  if ('status' in error) {
    const errMsg = 'error' in error ? error.error : JSON.stringify(error.data)
    showErrorToast(errMsg)
  } else {
    const serializedError = error as { message?: string; name?: string; stack?: string; code?: string }
    showErrorToast(serializedError.message || 'Some error occurred')
  }
}
