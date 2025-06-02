import { artistsEndpoint } from "@/common/apiEntities"
import { instance } from "@/common/instance"
import type { Artist } from "./artistsApi.types.ts"

export const artistsApi = {
  findArtists: (name: string) => {
    return instance.get<Artist[]>(`${artistsEndpoint}/search?term=${name}`)
  },
  createArtist: (name: string) => {
    return instance.post<Artist>(artistsEndpoint, { name })
  },
  removeArtist: (id: string) => {
    return instance.delete<void>(`${artistsEndpoint}/${id}`)
  },
}
