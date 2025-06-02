import { instance } from "@/common/instance"
import type { Tag } from "@/features/tags/api/tagsApi.types.ts"

export const TagsQueryKey = "artists"
const tagsEndpoint = "tags"

export const tagsApi = {
  findTags: (value: string) => {
    return instance.get<any[]>(`${tagsEndpoint}/search?search=${value}`)
  },
  createTag: (name: string) => {
    return instance.post<Tag>(tagsEndpoint, { name })
  },
  removeTag: (id: string) => {
    return instance.delete<any>(`${tagsEndpoint}/${id}`)
  },
}
