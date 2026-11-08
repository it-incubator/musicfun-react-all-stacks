import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import type { SerializedError } from "@reduxjs/toolkit"

/** 404, or 400 for a malformed (non-UUID) id — both mean "there is no such item" */
export const isNotFoundError = (error: FetchBaseQueryError | SerializedError | undefined) =>
  !!error && "status" in error && (error.status === 404 || error.status === 400)
