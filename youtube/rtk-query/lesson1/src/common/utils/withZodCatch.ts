import { errorToast } from '@/common/utils/errorToast.ts'
import { type FetchBaseQueryError, NamedSchemaError } from '@reduxjs/toolkit/query/react'
import type { ZodType } from 'zod'

export const withZodCatch = <T extends ZodType>(schema: T) => ({
  responseSchema: schema,
  catchSchemaFailure: (err: NamedSchemaError): FetchBaseQueryError => {
    errorToast('Zod error. Details in the console', err.issues)
    return {
      status: 'CUSTOM_ERROR',
      error: 'Schema validation failed',
    }
  },
})
