// types/api.ts

import { type ExtractError } from './json-api-error.ts'

//-----------------------------------------------------------------------------
// utils/requestWrapper.ts
//-----------------------------------------------------------------------------
// «Умный» обёртчик: Infers Data и Error из P,
// возвращает Promise<Data>, а в случае ошибки — throw Error
export type ExtractData<T> = T extends { data?: infer D } ? NonNullable<D> : never

export async function unwrap<P extends Promise<{ data?: unknown; error?: unknown }>>(
  promise: P
): Promise<ExtractData<Awaited<P>>> {
  const res = (await promise) as Awaited<P>
  if ((res as { error?: unknown }).error) {
    // здесь E = ExtractError<Awaited<P>>
    throw (res as { error: ExtractError<Awaited<P>> }).error
  }
  return (res as { data: ExtractData<Awaited<P>> }).data
}
