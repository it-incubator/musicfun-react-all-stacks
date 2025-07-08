import type { FieldValues, UseFormSetError } from 'react-hook-form'
import { isJsonApiErrorDocument, type JsonApiErrorDocument, parseJsonApiErrors } from './json-api-error.ts'
import { toast } from 'react-toastify'

export const queryErrorHandlerForRHFFactory = <T extends FieldValues>({
  setError,
}: {
  setError?: UseFormSetError<T>
}) => {
  return (err: JsonApiErrorDocument) => {
    // 400 от сервера в JSON:API формате
    if (isJsonApiErrorDocument(err)) {
      const { fieldErrors, globalErrors } = parseJsonApiErrors(err)

      // полевые ошибки
      for (const [field, message] of Object.entries(fieldErrors)) {
        setError?.(field as any, { type: 'server', message })
      }

      // «глобальные» (без pointer)
      if (globalErrors.length > 0) {
        setError?.('root.server', {
          type: 'server',
          message: globalErrors.join('\n'),
        })
        toast(globalErrors.join('\n'))
      }

      return
    }
  }
}

export const mutationGlobalErrorHandler = (error: Error, variables, context, mutation) => {
  // 400 от сервера в JSON:API формате
  const globalFlag = (mutation.meta as Record<string, any>)?.globalErrorHandler
  // если в meta сказали "off" — ничего не делаем
  if (globalFlag === 'off') {
    return
  }

  console.log('global')
  if (isJsonApiErrorDocument(error)) {
    const { globalErrors } = parseJsonApiErrors(error)

    // «глобальные» (без pointer)
    if (globalErrors.length > 0) {
      toast(globalErrors.join('\n'))
    }
  }
}
