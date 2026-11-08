import type { BaseQueryApi, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react"

import { baseApi } from "@/app/api/baseApi.ts"
import { isTokens } from "@/common/utils"

import { type AuthMethod, authEndpoints, tokenStorage } from "../lib/tokens.ts"
import type { MeResponse, OAuthLoginArgs, SimpleLoginArgs, TokensResponse } from "./authApi.types.ts"

type BaseQuery = (args: string | FetchArgs) => PromiseLike<{ data?: unknown; error?: FetchBaseQueryError }> | object

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<MeResponse, void>({
      query: () => "auth/me",
      providesTags: ["Me"],
    }),
    // OAuth flow: code from API Hub → token pair
    login: build.mutation<TokensResponse, OAuthLoginArgs>({
      queryFn: (body, api, _extraOptions, baseQuery) =>
        loginWith("oauth", { url: "auth/login", method: "post", body }, api, baseQuery),
    }),
    // Login/password flow
    simpleLogin: build.mutation<TokensResponse, SimpleLoginArgs>({
      queryFn: (body, api, _extraOptions, baseQuery) =>
        loginWith("simple", { url: "auth/simple/login", method: "post", body }, api, baseQuery),
    }),
    logout: build.mutation<void, void>({
      queryFn: async (_args, _api, _extraOptions, baseQuery) => {
        const refreshToken = tokenStorage.getRefreshToken()
        const method = tokenStorage.getAuthMethod()
        // Even if the server call fails, the user must end up logged out locally
        if (refreshToken) {
          await baseQuery({ url: authEndpoints.logout(method), method: "post", body: { refreshToken } })
        }
        return { data: undefined }
      },
      onQueryStarted: async (_args, { queryFulfilled, dispatch }) => {
        await queryFulfilled
        tokenStorage.clear()
        dispatch(baseApi.util.resetApiState())
      },
    }),
  }),
})

/**
 * Exchanges credentials for tokens, saves them and loads the profile
 * before the mutation resolves — so the UI can redirect right after `unwrap()`.
 */
const loginWith = async (method: AuthMethod, args: FetchArgs, api: BaseQueryApi, baseQuery: BaseQuery) => {
  const result = (await baseQuery(args)) as { data?: unknown; error?: FetchBaseQueryError }
  if (result.error) return { error: result.error }
  if (!isTokens(result.data)) {
    return { error: { status: "CUSTOM_ERROR", error: "Unexpected login response" } as FetchBaseQueryError }
  }

  tokenStorage.save(result.data, method)
  await api.dispatch(authApi.endpoints.me.initiate(undefined, { forceRefetch: true }))
  return { data: result.data }
}

export const { useMeQuery, useLoginMutation, useSimpleLoginMutation, useLogoutMutation } = authApi
