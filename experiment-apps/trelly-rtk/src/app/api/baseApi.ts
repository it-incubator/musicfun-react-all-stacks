import { createApi } from "@reduxjs/toolkit/query/react"

import { baseQueryWithReauth } from "./baseQueryWithReauth.ts"

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["Me", "Board", "BoardTasks", "Task", "GlobalTasks"],
  endpoints: () => ({}),
  baseQuery: baseQueryWithReauth,
})
