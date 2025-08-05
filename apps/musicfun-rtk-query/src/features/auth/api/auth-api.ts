import { baseApi } from '@/app/api/base-api.ts'
import { localStorageKeys } from '@/app/api/base-query-with-refresh-token-flow-api'

import type { AuthTokensResponse, GetMeResponse, OAuthLoginArgs } from './auth-api.types'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query<GetMeResponse, void>({
      query: () => 'auth/me',
      providesTags: ['User'],
    }),

    login: builder.mutation<AuthTokensResponse, OAuthLoginArgs>({
      query: (payload) => ({
        url: 'auth/login',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          localStorage.setItem(localStorageKeys.refreshToken, data.refreshToken)
          localStorage.setItem(localStorageKeys.accessToken, data.accessToken)
        } catch {}
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
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
      invalidatesTags: ['User'],
    }),
  }),
})

export const { useMeQuery, useLoginMutation, useLogoutMutation } = authApi
