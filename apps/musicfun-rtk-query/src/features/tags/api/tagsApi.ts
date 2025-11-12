export const MOCK_HASHTAGS: Tag[] = [
  { id: '1', name: 'Rock' },
  { id: '2', name: 'Jazz' },
  { id: '3', name: 'Blues' },
  { id: '4', name: 'Metal' },
  { id: '5', name: 'Folk' },
  { id: '6', name: 'Coding' },
  { id: '7', name: 'Dark Ambient' },
  { id: '8', name: 'Chill' },
  { id: '9', name: 'Lo-fi' },
]

export const MOCK_5_HASHTAGS = MOCK_HASHTAGS.slice(0, 5)

export type TagDto = {
  id: string
  name: string
}

import { baseApi } from '@/app/api/base-api.ts'

import type { Tag } from './tagsApi.types.ts'

export const tagsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    findTags: build.query<Tag[], { value: string }>({
      query: ({ value }) => `/tags/search?search=${value}`,
      providesTags: ['Tag'],
    }),
    createTag: build.mutation<void, { name: string }>({
      query: (body) => ({ url: '/tags', method: 'POST', body }),
      invalidatesTags: ['Tag'],
    }),
    removeTag: build.mutation<Tag, { id: string }>({
      query: (body) => ({ url: `/tags/${body.id}`, method: 'DELETE', body }),
      invalidatesTags: ['Tag'],
    }),
  }),
})

export const { useFindTagsQuery, useCreateTagMutation, useRemoveTagMutation } = tagsApi
