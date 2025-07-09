import { baseQueryWithReauth } from "./baseQueryWithReauth.ts"
import { createApi } from "@reduxjs/toolkit/query/react"

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["Board", "Task", "Auth"],
  endpoints: () => ({}),
  baseQuery: baseQueryWithReauth,
})
