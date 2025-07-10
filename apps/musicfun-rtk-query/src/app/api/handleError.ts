import {
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
  type QueryReturnValue,
} from '@reduxjs/toolkit/query'

import type { ExtensionsError } from '@/shared/types'
import { showErrorToast } from '@/shared/utils'

export const handleError = (
  result: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
) => {
  const error = 'Some error occurred'

  if (result.error) {
    const extensionsError = (result.error as ExtensionsError)?.data?.extensions
    const message = (result.error.data as { message: string }).message

    if (result.error.status === 401 || extensionsError?.length) return

    if (result.error.status === 500) {
      showErrorToast(error)
    }

    showErrorToast(message)
  }
}
