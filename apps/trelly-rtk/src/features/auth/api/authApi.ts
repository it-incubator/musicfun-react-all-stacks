import { baseApi } from "@/app/baseApi"
import { LOCALSTORAGE_KEYS } from "@/common/constants"
import type { BaseResponse } from "@/common/types"
import type { LoginArgs, LoginResponse } from "./authApi.types.ts"

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginArgs>({
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
      query: (body) => ({ url: "auth/login", method: "POST", body }),
    }),
    logout: build.mutation<BaseResponse, void>({
      query: () => ({
        url: "auth/login",
        method: "DELETE",
      }),
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation } = authApi
