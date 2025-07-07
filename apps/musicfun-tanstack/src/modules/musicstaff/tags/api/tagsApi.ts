import { tagsEndpoint } from '@/common/apiEntities'
import { getInstance } from '@/common/instance'
import type { Tag } from './tagsApi.types.ts'

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
