import { baseApi } from "@/app/api/baseApi.ts"
import { LOCALSTORAGE_KEYS } from "@/common/constants"
import type { LoginArgs, OAuthResponse } from "./authApi.types.ts"

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<{ userId: string; login: string }, void>({
      query: () => "auth/me",
      providesTags: ["Auth"],
    }),
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
      invalidatesTags: ["Auth"],
    }),
    logout: build.mutation<void, void>({
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        await queryFulfilled
        localStorage.removeItem(LOCALSTORAGE_KEYS.accessToken)
        localStorage.removeItem(LOCALSTORAGE_KEYS.refreshToken)
        dispatch(baseApi.util.resetApiState())
      },
      query: () => {
        const refreshToken = localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken)
        return { url: "auth/logout", method: "post", body: { refreshToken } }
      },
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation, useMeQuery } = authApi
