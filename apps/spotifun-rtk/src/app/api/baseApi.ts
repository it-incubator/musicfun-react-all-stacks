import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["Playlist", "Track", "Artist", "Tag"],
  baseQuery: async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL!,
      prepareHeaders: (headers) => {
        headers.set("API-KEY", import.meta.env.VITE_API_KEY)
        const accessToken = localStorage.getItem("accessToken") || import.meta.env.VITE_AUTH_TOKEN
        headers.set("Authorization", `Bearer ${accessToken}`)
      },
      headers: { "API-KEY": import.meta.env.VITE_API_KEY! },
    })(args, api, extraOptions)

    // Todo: реализовать handleError для обработки ошибок
    // handleError(api, result)

    return result
  },
  endpoints: () => ({}),
})
