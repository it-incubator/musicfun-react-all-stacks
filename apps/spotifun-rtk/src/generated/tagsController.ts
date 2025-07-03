import { baseApi as api } from "../app/api/base-api"
export const addTagTypes = ["Tags"] as const
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      tagsControllerCreateTag: build.mutation<TagsControllerCreateTagResponse, TagsControllerCreateTagArgs>({
        query: (queryArg) => ({ url: `/api/1.0/tags`, method: "POST", body: queryArg.tagCreateInputDto }),
        invalidatesTags: ["Tags"],
      }),
      tagsControllerSearchTags: build.query<TagsControllerSearchTagsResponse, TagsControllerSearchTagsArgs>({
        query: (queryArg) => ({
          url: `/api/1.0/tags/search`,
          params: {
            search: queryArg.search,
          },
        }),
        providesTags: ["Tags"],
      }),
      tagsControllerDeleteTag: build.mutation<TagsControllerDeleteTagResponse, TagsControllerDeleteTagArgs>({
        query: (queryArg) => ({ url: `/api/1.0/tags/${queryArg.id}`, method: "DELETE" }),
        invalidatesTags: ["Tags"],
      }),
    }),
    overrideExisting: false,
  })
export { injectedRtkApi as generatedApi }
export type TagsControllerCreateTagResponse = /** status 201 Created: Тег успешно создан */ TagDto
export type TagsControllerCreateTagArgs = {
  tagCreateInputDto: TagCreateInputDto
}
export type TagsControllerSearchTagsResponse = /** status 200 OK: Список подходящих тегов */ TagDto[]
export type TagsControllerSearchTagsArgs = {
  /** Подстрока для поиска тегов (по нормализованному имени) */
  search: string
}
export type TagsControllerDeleteTagResponse = unknown
export type TagsControllerDeleteTagArgs = {
  /** ID удаляемого тега */
  id: string
}
export type TagDto = {
  id: string
  name: string
}
export type TagCreateInputDto = {
  name: string
}
export const {
  useTagsControllerCreateTagMutation,
  useTagsControllerSearchTagsQuery,
  useTagsControllerDeleteTagMutation,
} = injectedRtkApi
