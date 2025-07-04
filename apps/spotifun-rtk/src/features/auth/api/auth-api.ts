import { baseApi } from "@/app/api/base-api"
import { authEndpoint } from "@/common/apiEntities"
import type { OAuthLoginArgs, RefreshTokensArgs, AuthTokensResponse, MeResponseResponse } from "./authApi.types"
import { localStorageKeys } from "@/app/api/base-query-with-refresh-token-flow-api.ts"

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // 1) Логин
    login: build.mutation<AuthTokensResponse, OAuthLoginArgs>({
      query: (payload) => ({
        url: `${authEndpoint}/login`,
        method: "POST",
        body: payload,
      }),
      // После успешного логина сохраняем токены и инвалидируем
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          localStorage.setItem(localStorageKeys.refreshToken, data.refreshToken)
          localStorage.setItem(localStorageKeys.accessToken, data.accessToken)
          // Инвалидируем ПОСЛЕ сохранения токенов
          dispatch(authApi.util.invalidateTags(["User"]))
        } catch {}
      },
    }),

    // 2) Логаут
    logout: build.mutation<void, void>({
      query: () => ({
        url: `${authEndpoint}/logout`,
        method: "POST",
        body: {
          refreshToken: localStorage.getItem(localStorageKeys.refreshToken)!,
        },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          localStorage.removeItem(localStorageKeys.accessToken)
          localStorage.removeItem(localStorageKeys.refreshToken)
          await dispatch(authApi.util.resetApiState())
        } catch {}
      },
      invalidatesTags: ["User"],
    }),

    // 3) Проверить «кто я»
    getMe: build.query<MeResponseResponse, void>({
      query: () => ({ url: `${authEndpoint}/me` }),
      providesTags: ["User"],
    }),

    // 4) Рефреш токена (если вдруг понадобится вызвать вручную)
    refreshToken: build.mutation<AuthTokensResponse, RefreshTokensArgs>({
      query: (payload) => ({
        url: `${authEndpoint}/refresh`,
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          localStorage.setItem(localStorageKeys.refreshToken, data.refreshToken)
          localStorage.setItem(localStorageKeys.accessToken, data.accessToken)
        } catch {}
      },
    }),
  }),
  overrideExisting: false,
})

export const { useLoginMutation, useLogoutMutation, useGetMeQuery } = authApi
