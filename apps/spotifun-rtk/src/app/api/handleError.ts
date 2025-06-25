import type { FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from "@reduxjs/toolkit/query"

import { showErrorToast } from '@/common/utils'

export const handleError = (
  result: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>,
) => {
  const error = "Some error occurred"

  if (result.error) {

    const message = (result.error.data as { message: string }).message

    if (result.error.status === 500) {
      showErrorToast(error)
    }

    showErrorToast(message)
  }
}
