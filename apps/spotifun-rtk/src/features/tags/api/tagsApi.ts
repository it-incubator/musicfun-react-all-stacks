import { tagsEndpoint } from "@/common/apiEntities"
import type { Tag } from "./tagsApi.types.ts"
import { baseApi } from "@/app/api/base-api.ts"

export const tagsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    findTags: build.query<Tag[], { value: string }>({
      query: (payload) => ({
        url: `${tagsEndpoint}/search?search=${payload.value}`,
        method: "GET",
      }),
      providesTags: ['Tag']
    }),

    createTag: build.mutation<void, { name: string }>({
      query: (payload) => ({
        url: tagsEndpoint,
        method: "POST",
        body: payload
      }),
      invalidatesTags: ['Tag']
    }),

    removeTag: build.mutation<Tag, { id: string }>({
      query: (payload) => ({
        url: `${tagsEndpoint}/${payload.id}`,
        method: "DELETE",
        body: payload
      }),
      invalidatesTags: ['Tag']
    }),
  }),
})

export const { useFindTagsQuery, useCreateTagMutation, useRemoveTagMutation } = tagsApi;

