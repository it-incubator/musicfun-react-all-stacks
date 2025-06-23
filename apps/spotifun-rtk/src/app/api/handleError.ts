import type { BaseQueryApi, FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from "@reduxjs/toolkit/query"
import { setError } from '../model/appSlice'

export const handleError = (
  api: BaseQueryApi,
  result: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
) => {
  let error = "Some error occurred"

  if (result.error) {
    const message = (result.error.data as { message: string }).message
    error = JSON.stringify(message)
    api.dispatch(setError(error))
  }
}
