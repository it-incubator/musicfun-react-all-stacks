import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["Playlist", "Track", "Artist", "Tag"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL!,
    headers: { "API-KEY": import.meta.env.VITE_API_KEY! },
  }),
  endpoints: () => ({}),
})
