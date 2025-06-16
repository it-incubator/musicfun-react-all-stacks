import { createApi } from "@reduxjs/toolkit/query/react"

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["Playlist", "Track", "Artist", "Tag"],
  baseQuery: () => ({ data: undefined }),
  endpoints: () => ({}),
})
