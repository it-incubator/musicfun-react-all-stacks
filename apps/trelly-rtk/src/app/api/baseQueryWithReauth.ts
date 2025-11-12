import { baseApi } from "@/app/api/baseApi.ts"
import { isTokens } from "@/common/utils/isTokens.ts"
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import { Mutex } from "async-mutex"
import { LOCALSTORAGE_KEYS } from "@/common/constants"
import { handleError } from "@/common/utils"
import { baseQuery } from "./baseQuery.ts"

const mutex = new Mutex()

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  await mutex.waitForUnlock() // wait until the mutex is available without locking it

  let result = await baseQuery(args, api, extraOptions)

  handleError(api, result) // Стандартная обработка ошибок

  // refresh logic
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshToken = localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken)

        if (!refreshToken) return result

        const { data } = await baseQuery(
          { url: "auth/refresh", method: "post", body: { refreshToken } as { refreshToken: string } },
          api,
          extraOptions,
        )

        if (data && isTokens(data)) {
          localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.accessToken)
          localStorage.setItem(LOCALSTORAGE_KEYS.refreshToken, data.refreshToken)

          result = await baseQuery(args, api, extraOptions) // Повтор запроса с новым токеном
        } else {
          // @ts-expect-error
          api.dispatch(baseApi.endpoints.logout.initiate())
        }
      } catch (err) {
        console.error("Token refresh failed:", err)
      } finally {
        // release must be called once the mutex should be released again.
        release()
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}
