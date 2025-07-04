import { LOCALSTORAGE_KEYS } from "@/common/constants"
import { handleError } from "@/common/utils"
import {
  type BaseQueryFn,
  createApi,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react"
import { Mutex } from "async-mutex"

const mutex = new Mutex()

// 3
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  headers: {
    "API-KEY": import.meta.env.VITE_API_KEY,
  },
  prepareHeaders: (headers) => {
    try {
      const accessToken = localStorage.getItem(LOCALSTORAGE_KEYS.accessToken)
      if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`)
    } catch (error) {
      console.warn("Failed to get token from localStorage:", error)
    }
    return headers
  },
})

// 2
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
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

        const refreshResult = await baseQuery(
          {
            url: "auth/refresh",
            method: "post",
            body: { refreshToken },
          },
          api,
          extraOptions,
        )

        if (refreshResult.data) {
          const newAccessToken = (refreshResult.data as any).accessToken
          const newRefreshToken = (refreshResult.data as any).refreshToken
          localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, newAccessToken)
          localStorage.setItem(LOCALSTORAGE_KEYS.refreshToken, newRefreshToken)

          result = await baseQuery(args, api, extraOptions) // Повтор запроса с новым токеном
        } else {
          // TODO: Точно нужно ?
          // api.dispatch(baseApi.endpoints.logout.initiate())
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

// 1
export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["Board", "Task"],
  endpoints: () => ({}),
  baseQuery: baseQueryWithReauth,
})
