import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { tokenStorage } from "@/features/auth/lib/tokens.ts"

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set("API-KEY", import.meta.env.VITE_API_KEY)

    const accessToken = tokenStorage.getAccessToken()
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`)
    }

    return headers
  },
})
