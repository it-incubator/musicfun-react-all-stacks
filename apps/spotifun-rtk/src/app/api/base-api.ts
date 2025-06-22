// 3. Создаём API
import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "@/app/api/base-query-with-refresh-token-flow-api.ts"

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Playlist", "Track", "Artist", "Tag", "User"],
  endpoints: () => ({})
})