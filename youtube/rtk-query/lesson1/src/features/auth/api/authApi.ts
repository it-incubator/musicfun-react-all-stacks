import { baseApi } from '@/app/api/baseApi.ts'
import type { MeResponse } from '@/features/auth/api/authApi.types.ts'

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<MeResponse, void>({
      query: () => `auth/me`,
    }),
  }),
})

export const { useGetMeQuery } = authApi
