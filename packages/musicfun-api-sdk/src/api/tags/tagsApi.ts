import type { Tag } from './tagsApi.types.ts'
import { tagsEndpoint } from '../../common/apiEntities/apiEntities'
import { getApiClient } from '../../v2/request'

export const tagsApi = {
  findTags: (value: string) => {
    return getApiClient().get<Tag[]>(`${tagsEndpoint}/search?search=${value}`)
  },
  createTag: (name: string) => {
    return getApiClient().post<Tag>(tagsEndpoint, { name })
  },
  removeTag: (id: string) => {
    return getApiClient().delete<void>(`${tagsEndpoint}/${id}`)
  },
}
