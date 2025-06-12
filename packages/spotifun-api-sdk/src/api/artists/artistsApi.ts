import type { Artist } from "./artistsApi.types.ts"
import { getInstance } from "../../common/instance/instance"
import { artistsEndpoint } from "../../common/apiEntities/apiEntities"

export const artistsApi = {
  findArtists: (name: string) => {
    return getInstance().get<Artist[]>(`${artistsEndpoint}/search?term=${name}`)
  },
  createArtist: (name: string) => {
    return getInstance().post<Artist>(artistsEndpoint, { name })
  },
  removeArtist: (id: string) => {
    return getInstance().delete<void>(`${artistsEndpoint}/${id}`)
  },
}
