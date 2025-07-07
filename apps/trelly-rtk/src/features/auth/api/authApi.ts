import { baseApi } from "@/app/baseApi"
import { LOCALSTORAGE_KEYS } from "@/common/constants"
import type { LoginArgs, OAuthResponse } from "./authApi.types.ts"

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<OAuthResponse, LoginArgs>({
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (!data) return
          localStorage.setItem(LOCALSTORAGE_KEYS.refreshToken, data.refreshToken)
          localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.accessToken)
        } catch (err) {
          console.log(err)
        }
      },
      query: (body) => ({ url: "auth/login", method: "post", body }),
    }),
    refresh: build.mutation<OAuthResponse, string>({
      query: (refreshToken) => ({ url: "auth/refresh", method: "post", body: { refreshToken } }),
    }),
    logout: build.mutation<void, void>({
      query: () => {
        const refreshToken = localStorage.getItem(LOCALSTORAGE_KEYS.accessToken)
        return { url: "auth/logout", method: "post", body: { refreshToken } }
      },
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        await queryFulfilled
        localStorage.removeItem(LOCALSTORAGE_KEYS.accessToken)
        localStorage.removeItem(LOCALSTORAGE_KEYS.refreshToken)
        dispatch(baseApi.util.resetApiState()) // TODO: Точно ли надо
      },
    }),
    me: build.mutation<{ userId: string; login: string }, void>({
      query: () => "auth/me",
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation } = authApi
