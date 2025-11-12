import type { Artist } from './artistsApi.types.ts'
import { artistsEndpoint } from '../../common/apiEntities/apiEntities'
import { getApiClient } from '../../v2/request'

export const artistsApi = {
  findArtists: (name: string) => {
    return getApiClient().get<Artist[]>(`${artistsEndpoint}/search?term=${name}`)
  },
  createArtist: (name: string) => {
    return getApiClient().post<Artist>(artistsEndpoint, { name })
  },
  removeArtist: (id: string) => {
    return getApiClient().delete<void>(`${artistsEndpoint}/${id}`)
  },
}
