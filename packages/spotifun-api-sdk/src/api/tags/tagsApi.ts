import type { Tag } from "./tagsApi.types.ts"
import { getInstance } from "../../common/instance/instance"
import { tagsEndpoint } from "../../common/apiEntities/apiEntities"

export const tagsApi = {
  findTags: (value: string) => {
    return getInstance().get<Tag[]>(`${tagsEndpoint}/search?search=${value}`)
  },
  createTag: (name: string) => {
    return getInstance().post<Tag>(tagsEndpoint, { name })
  },
  removeTag: (id: string) => {
    return getInstance().delete<void>(`${tagsEndpoint}/${id}`)
  },
}
