import { tagsEndpoint } from '@/common/apiEntities'
import type { Tag } from './tagsApi.types.ts'
import { baseApi } from '@/app/api/base-api.ts'

export const tagsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    findTags: build.query<Tag[], { value: string }>({
      query: ({ value }) => `${tagsEndpoint}/search?search=${value}`,
      providesTags: ['Tag'],
    }),
    createTag: build.mutation<void, { name: string }>({
      query: (body) => ({ url: tagsEndpoint, method: 'POST', body }),
      invalidatesTags: ['Tag'],
    }),
    removeTag: build.mutation<Tag, { id: string }>({
      query: (body) => ({ url: `${tagsEndpoint}/${body.id}`, method: 'DELETE', body }),
      invalidatesTags: ['Tag'],
    }),
  }),
})

export const { useFindTagsQuery, useCreateTagMutation, useRemoveTagMutation } = tagsApi
