import { baseApi } from "@/app/api/base-api"
import { authEndpoint } from "@/common/apiEntities"
import { localStorageKeys } from "@/app/api/base-query-with-refresh-token-flow-api.ts"

import type { OAuthLoginArgs, RefreshTokensArgs, AuthTokensResponse, MeResponseResponse } from "./authApi.types"

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthTokensResponse, OAuthLoginArgs>({
      query: (payload) => ({
        url: `${authEndpoint}/login`,
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          localStorage.setItem(localStorageKeys.refreshToken, data.refreshToken)
          localStorage.setItem(localStorageKeys.accessToken, data.accessToken)
          dispatch(authApi.util.invalidateTags(["User"]))
        } catch {}
      },
    }),

    logout: build.mutation<void, void>({
      query: () => ({
        url: `${authEndpoint}/logout`,
        method: "POST",
        body: {
          refreshToken: localStorage.getItem(localStorageKeys.refreshToken)!,
        },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          localStorage.removeItem(localStorageKeys.accessToken)
          localStorage.removeItem(localStorageKeys.refreshToken)
          await dispatch(authApi.util.resetApiState())
        } catch {}
      },
      invalidatesTags: ["User"],
    }),

    getMe: build.query<MeResponseResponse, void>({
      query: () => ({ url: `${authEndpoint}/me` }),
      providesTags: ["User"],
    }),

    refreshToken: build.mutation<AuthTokensResponse, RefreshTokensArgs>({
      query: (payload) => ({
        url: `${authEndpoint}/refresh`,
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
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

export const { useLoginMutation, useLogoutMutation, useGetMeQuery, useLazyGetMeQuery, useRefreshTokenMutation } =
  authApi

export const getOauthUrl = (redirectUrl: string) =>
  `${import.meta.env.VITE_BASE_URL}/${authEndpoint}/oauth-redirect?callbackUrl=${encodeURIComponent(redirectUrl)}`
