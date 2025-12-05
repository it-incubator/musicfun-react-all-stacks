import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { baseQueryWithReauth } from './base-query-with-refresh-token-flow-api'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Playlist', 'Track', 'Artist', 'Tag', 'User'],
  endpoints: () => ({}),
})
