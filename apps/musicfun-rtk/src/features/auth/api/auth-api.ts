import { baseApi } from '@/app/api/base-api'
import { authEndpoint } from '@/common/apiEntities'
import type { OAuthLoginArgs, RefreshTokensArgs, AuthTokensResponse, MeResponseResponse } from './authApi.types'
import { localStorageKeys } from '@/app/api/base-query-with-refresh-token-flow-api.ts'

/**
 * Authentication API endpoints for user management.
 * Handles login, logout, user profile, and token refresh operations.
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // 1) Login
    login: build.mutation<AuthTokensResponse, OAuthLoginArgs>({
      query: (payload) => ({
        url: `${authEndpoint}/login`,
        method: 'POST',
        body: payload,
      }),
      // Save tokens and invalidate user cache after successful login
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled
        localStorage.setItem(localStorageKeys.refreshToken, data.refreshToken)
        localStorage.setItem(localStorageKeys.accessToken, data.accessToken)
        // Invalidate AFTER saving tokens
        dispatch(authApi.util.invalidateTags(['User']))
      },
    }),

    // 2) Logout
    logout: build.mutation<void, void>({
      query: () => ({
        url: `${authEndpoint}/logout`,
        method: 'POST',
        body: {
          refreshToken: localStorage.getItem(localStorageKeys.refreshToken)!,
        },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled
        localStorage.removeItem(localStorageKeys.accessToken)
        localStorage.removeItem(localStorageKeys.refreshToken)
        await dispatch(authApi.util.resetApiState())
      },
    }),

    // 3) Check "who am I"
    getMe: build.query<MeResponseResponse, void>({
      query: () => ({ url: `${authEndpoint}/me` }),
      providesTags: ['User'],
    }),

    // 4) Refresh token (if need to call manually)
    refreshToken: build.mutation<AuthTokensResponse, RefreshTokensArgs>({
      query: (payload) => ({
        url: `${authEndpoint}/refresh`,
        method: 'POST',
        body: payload,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        const { data } = await queryFulfilled
        localStorage.setItem(localStorageKeys.refreshToken, data.refreshToken)
        localStorage.setItem(localStorageKeys.accessToken, data.accessToken)
      },
    }),
  }),
  overrideExisting: false,
})

export const { useLoginMutation, useLogoutMutation, useGetMeQuery } = authApi
