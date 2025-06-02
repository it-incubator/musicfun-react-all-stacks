import { instance } from "@/common/instance"
import type { Tag } from "./tagsApi.types.ts"

export const TagsQueryKey = "tags"
const tagsEndpoint = "tags"

export const tagsApi = {
  findTags: (value: string) => {
    return instance.get<Tag[]>(`${tagsEndpoint}/search?search=${value}`)
  },
  createTag: (name: string) => {
    return instance.post<Tag>(tagsEndpoint, { name })
  },
  removeTag: (id: string) => {
    return instance.delete<void>(`${tagsEndpoint}/${id}`)
  },
}
