import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import { Mutex } from "async-mutex"

import { baseApi } from "@/app/api/baseApi.ts"
import { handleError, isTokens } from "@/common/utils"
import { authEndpoints, tokenStorage } from "@/features/auth/lib/tokens.ts"

import { baseQuery } from "./baseQuery.ts"

const mutex = new Mutex()

// 401 from these endpoints means wrong credentials/tokens, not an expired access token
const NO_REFRESH_URLS = ["auth/login", "auth/refresh", "auth/logout", "auth/simple/"]

const getUrl = (args: string | FetchArgs) => (typeof args === "string" ? args : args.url)

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  await mutex.waitForUnlock() // wait until the mutex is available without locking it

  let result = await baseQuery(args, api, extraOptions)

  const canRefresh = !NO_REFRESH_URLS.some((url) => getUrl(args).startsWith(url))

  // refresh logic
  if (result.error && result.error.status === 401 && canRefresh) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshToken = tokenStorage.getRefreshToken()

        if (refreshToken) {
          const method = tokenStorage.getAuthMethod()
          const { data } = await baseQuery(
            { url: authEndpoints.refresh(method), method: "post", body: { refreshToken } },
            api,
            extraOptions,
          )

          if (isTokens(data)) {
            tokenStorage.save(data)
            result = await baseQuery(args, api, extraOptions) // Повтор запроса с новым токеном
          } else {
            // refresh token is expired or revoked: the session is over
            tokenStorage.clear()
            api.dispatch(baseApi.util.resetApiState())
          }
        }
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

  handleError(api, result.error) // Стандартная обработка ошибок

  return result
}
