import {
  type BaseQueryFn,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'

import { baseApi } from '@/app/api/base-api.ts'

import { handleError } from './handleError.ts'

export const localStorageKeys = {
  refreshToken: 'musicfun-refresh-token',
  accessToken: 'musicfun-access-token',
}

const mutex = new Mutex()

/**Базовый запрос с авторизацией */
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers) => {
    if (import.meta.env.VITE_API_KEY) {
      headers.set('API-KEY', import.meta.env.VITE_API_KEY)
    }
    const token =
      localStorage.getItem(localStorageKeys.accessToken) ?? import.meta.env.VITE_AUTH_TOKEN
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    // headers.set("Content-Type", "application/json")
    // TODO: Мешает этот параметр для отправки файлов, RTK Query сам правильно определяет Content-Type в зависимости от типа данных.
    return headers
  },
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          searchParams.append(key, String(item))
        })
      } else if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    })

    return searchParams.toString()
  },
})

/**Обёртка с логикой рефреша */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Если кто-то уже рефрешит — ждём
  await mutex.waitForUnlock()
  // основной запрос
  let result = await baseQuery(args, api, extraOptions)

  handleError(result)

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()

      try {
        const refreshToken = localStorage.getItem(localStorageKeys.refreshToken)
        if (!refreshToken) {
          console.warn('No refresh token available')
          return result
        }

        const refreshResult = await baseQuery(
          {
            url: 'auth/refresh',
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions
        )

        if (refreshResult.data) {
          const newAccessToken = (refreshResult.data as any).accessToken
          const newRefreshToken = (refreshResult.data as any).refreshToken
          localStorage.setItem(localStorageKeys.accessToken, newAccessToken)
          localStorage.setItem(localStorageKeys.refreshToken, newRefreshToken)

          // Повтор запроса с новым токеном
          result = await baseQuery(args, api, extraOptions)
        } else {
          console.log('Logout: refresh token invalid or expired')
          // диспатчим logout
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          //api.dispatch(baseApi.endpoints.logout.initiate())

          // можно перенаправить пользователся на страницу login/auth
          // window.location.href = "/login"
        }
      } catch (e) {
        console.error('Token refresh failed:', e)
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}
