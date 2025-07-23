import { showErrorToast, isFetchBaseQueryError } from '@/common/utils'
import { isErrorWithMessage } from '@/common/utils/errorTypeGuards'
import type { ExtensionsError } from '@/common/types'
import type { QueryReturnValue, FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query'

const DEFAULT_ERROR_MESSAGE = 'Some error occurred'

const extractErrorMessage = (error: unknown): string => {
  if (!error) return DEFAULT_ERROR_MESSAGE

  if (isFetchBaseQueryError(error)) {
    if (error.data && typeof error.data === 'object') {
      const data = error.data as { error?: string; message?: string }
      return data.error ?? DEFAULT_ERROR_MESSAGE
    }

    if ('error' in error && typeof error.error === 'string') {
      return error.error
    }

    return DEFAULT_ERROR_MESSAGE
  }

  if (isErrorWithMessage(error)) {
    return error.message
  }

  return DEFAULT_ERROR_MESSAGE
}

/**
 * Обрабатывает ошибки в baseQuery (централизованно для всех API запросов)
 *
 * Показывает тосты для всех ошибок кроме системных:
 * - Пропускает 401 ошибки (для refresh token логики)
 * - Пропускает extensions ошибки (для форм с валидацией)
 * - Показывает все остальные ошибки пользователю
 *
 * @param result - Результат выполнения baseQuery из RTK Query
 *
 * @example
 * // В baseQuery:
 * let result = await baseQuery(args, api, extraOptions)
 * handleApiResult(result) // Покажет тост если есть ошибка
 *
 * @see {@link handleError} для обработки ошибок в компонентах
 */
export const handleApiResult = (result: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>): void => {
  if (!result.error) return

  const extensions = (result.error as ExtensionsError)?.data?.extensions
  if (result.error.status === 401 || extensions?.length) return

  showErrorToast(extractErrorMessage(result.error))
}

/**
 * Обрабатывает ошибки в компонентах и хуках
 *
 * Извлекает понятное сообщение из любого типа ошибки и показывает тост пользователю.
 * Используется когда нужно явно обработать ошибку в компоненте.
 *
 * @param error - Любая ошибка (RTK Query, JavaScript Error, или unknown)
 *
 * @example
 * // В компонентах при необходимости явной обработки:
 * try {
 *   await someMutation(data).unwrap()
 * } catch (error) {
 *   handleError(error) // Покажет "Not Found", "Some error occurred" и т.д.
 * }
 *
 * // В хуках:
 * .catch(error => handleError(error))
 *
 * @remarks
 * В большинстве случаев ошибки обрабатываются автоматически через handleApiResult в baseQuery.
 * Используйте эту функцию только когда нужна специфическая обработка в компоненте.
 *
 * @see {@link handleApiResult} для автоматической обработки в baseQuery
 */
export const handleError = (error: unknown): void => {
  showErrorToast(extractErrorMessage(error))
}
