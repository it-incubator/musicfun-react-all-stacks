import { LOCALSTORAGE_KEYS } from "@/common/constants"
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  headers: {
    "API-KEY": import.meta.env.VITE_API_KEY,
  },
  prepareHeaders: (headers) => {
    try {
      const accessToken = localStorage.getItem(LOCALSTORAGE_KEYS.accessToken)
      if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`)
    } catch (error) {
      console.warn("Failed to get token from localStorage:", error)
    }
    return headers
  },
})
