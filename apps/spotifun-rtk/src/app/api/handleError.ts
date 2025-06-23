import type { BaseQueryApi, FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from "@reduxjs/toolkit/query"
import { setError } from "../model/errorSlice"

export const handleError = (
  api: BaseQueryApi,
  result: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
) => {
  let error = "Some error occurred"

  if (result.error) {
    const message = (result.error.data as { message: string }).message
    switch (result.error.status) {
      case 400:
      case 500:
        error = JSON.stringify(message)
        break
      default:
        error = JSON.stringify(message)
        break
    }
    api.dispatch(setError(error))
  }

}
