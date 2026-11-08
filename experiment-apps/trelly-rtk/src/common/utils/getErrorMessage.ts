import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react"

import type { JsonApiErrorDocument } from "@/common/types"

const isJsonApiErrorDocument = (data: unknown): data is JsonApiErrorDocument =>
  typeof data === "object" && data !== null && "errors" in data && Array.isArray(data.errors)

const getMessageField = (data: unknown): string | null => {
  if (typeof data !== "object" || data === null || !("message" in data)) return null
  const { message } = data
  if (typeof message === "string") return message
  if (Array.isArray(message)) return message.join(", ")
  return null
}

/**
 * Turns any backend error into a human-readable string.
 * Supports JSON:API error documents ({ errors: [{ detail, title }] })
 * and Nest's plain bodies ({ statusCode, message, error }).
 */
export const getErrorMessage = (error: FetchBaseQueryError): string => {
  switch (error.status) {
    case "FETCH_ERROR":
      return "Network error. Check your connection"
    case "PARSING_ERROR":
    case "CUSTOM_ERROR":
    case "TIMEOUT_ERROR":
      return error.error
  }

  if (isJsonApiErrorDocument(error.data)) {
    const messages = error.data.errors.map((e) => e.detail || e.title).filter(Boolean)
    if (messages.length) return messages.join(". ")
  }

  const message = getMessageField(error.data)
  if (message) return message

  if (error.status === 403) return "403 Forbidden. Check API-KEY"
  return `Request failed with status ${error.status}`
}
