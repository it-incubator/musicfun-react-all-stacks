import { handleErrors } from '@/common/utils'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  tagTypes: ['Playlist'],
  baseQuery: async (args, api, extraOptions) => {
    // await new Promise((resolve) => setTimeout(resolve, 2000)) // delay

    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      headers: {
        'API-KEY': import.meta.env.VITE_API_KEY,
      },
      prepareHeaders: (headers) => {
        headers.set('Authorization', `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
        return headers
      },
    })(args, api, extraOptions)

    if (result.error) {
      handleErrors(result.error)
    }

    return result
  },
  endpoints: () => ({}),
})
