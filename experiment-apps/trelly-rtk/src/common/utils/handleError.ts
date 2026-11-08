import type { BaseQueryApi, FetchBaseQueryError } from "@reduxjs/toolkit/query/react"

import { showNotificationAC } from "@/app/model/app-slice.ts"

import { getErrorMessage } from "./getErrorMessage"

export const handleError = (api: BaseQueryApi, error: FetchBaseQueryError | undefined) => {
  if (!error) return
  // 401 is handled by the refresh logic; an anonymous user is not an error
  if (error.status === 401) return
  // a missing item is rendered by the page itself ("Board not found"), no toast needed
  if (api.type === "query" && error.status === 404) return

  api.dispatch(showNotificationAC({ message: getErrorMessage(error), severity: "error" }))
}
