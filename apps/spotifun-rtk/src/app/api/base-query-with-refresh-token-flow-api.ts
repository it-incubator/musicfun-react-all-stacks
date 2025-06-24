import {
  type BaseQueryFn,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react"
import { Mutex } from "async-mutex"
import { handleError } from "./handleError"

export const localStorageKeys = {
  refreshToken: "spotifun-refresh-token",
  accessToken: "spotifun-access-token",
}

const mutex = new Mutex()

// 1. Базовый запрос с авторизацией
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL!,
  prepareHeaders: (headers, { getState }) => {
    headers.set("API-KEY", import.meta.env.VITE_API_KEY)
    const token = localStorage.getItem(localStorageKeys.accessToken) ?? import.meta.env.VITE_AUTH_TOKEN
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
    return headers // ← обязательно вернуть
  },
})

// 2. Обёртка с логикой рефреша
export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  // Если кто-то уже рефрешит — ждём
  await mutex.waitForUnlock()

  // основной запрос
  let result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    // если токен уже обновляется в другом месте — просто повторяем
    if (mutex.isLocked()) {
      await mutex.waitForUnlock()
      return baseQuery(args, api, extraOptions)
    }

    // иначе блокируем mutex и обновляем токен
    const release = await mutex.acquire()
    try {
      const refreshResult = await baseQuery(
        {
          url: "auth/refresh",
          method: "POST",
          body: {}, // при необходимости { refreshToken: "…" }
        },
        api,
        extraOptions
      )

      if (refreshResult.data) {
        // @ts-ignore — привести к вашему типу
        localStorage.setItem(localStorageKeys.accessToken, (refreshResult.data as any).accessToken)
        // повторяем исходный запрос
        result = await baseQuery(args, api, extraOptions)
      } else {
        // здесь можно диспачить действия logout
      }
    } catch (e) {
      console.error("Failed to refresh token:", e)
    } finally {
      release()
    }
  }
  handleError(api, result)
  return result
}
