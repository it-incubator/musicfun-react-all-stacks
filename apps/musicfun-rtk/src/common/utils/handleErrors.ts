import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { errorToast } from './errorToast'
import { isErrorWithDetailArray } from './isErrorWithDetailArray'
import { isErrorWithProperty } from './isErrorWithProperty'
import { trimToMaxLength } from './trimToMaxLength'

/**
 * Handles different types of RTK Query errors and shows appropriate user notifications.
 *
 * Processes various error statuses and formats error messages for display.
 * Shows error toasts with user-friendly messages.
 *
 * @param {FetchBaseQueryError} error - RTK Query error object
 *
 * @example
 * handleErrors(queryResult.error)
 */
export const handleErrors = (error: FetchBaseQueryError) => {
  if (error) {
    switch (error.status) {
      case 'FETCH_ERROR':
      case 'PARSING_ERROR':
      case 'CUSTOM_ERROR':
      case 'TIMEOUT_ERROR':
        errorToast(error.error)
        break

      case 400:
      case 403:
        if (isErrorWithDetailArray(error.data)) {
          errorToast(trimToMaxLength(error.data.errors[0].detail))
        } else {
          errorToast(JSON.stringify(error.data))
        }
        break

      case 404:
        if (isErrorWithProperty(error.data, 'error')) {
          errorToast(error.data.error)
        } else if (isErrorWithDetailArray(error.data)) {
          errorToast(trimToMaxLength(error.data.errors[0].detail))
        } else {
          errorToast(JSON.stringify(error.data))
        }
        break

      case 429:
        if (isErrorWithProperty(error.data, 'message')) {
          errorToast(error.data.message)
        } else {
          errorToast(JSON.stringify(error.data))
        }
        break

      default:
        if (error.status >= 500 && error.status < 600) {
          errorToast('Server error occurred. Please try again later.', error)
        } else {
          errorToast('Some error occurred')
        }
    }
  }
}
