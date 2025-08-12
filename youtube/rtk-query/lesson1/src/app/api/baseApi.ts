import { baseQueryWithReauth } from '@/app/api/baseQueryWithReauth.ts'
import { createApi } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  tagTypes: ['Playlist', 'Auth'],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  // skipSchemaValidation: process.env.NODE_ENV === 'production',
})
