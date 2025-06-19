import { artistsEndpoint } from "@/common/apiEntities"
import { getInstance } from "@/common/instance"
import type { Artist } from "./artistsApi.types.ts"

export const artistsApi = {
  findArtists: (name: string) => {
    const a = getInstance().get<Artist[]>(`${artistsEndpoint}/search?term=${name}`)
    debugger
    return a
  },
  createArtist: (name: string) => {
    return getInstance().post<Artist>(artistsEndpoint, { name })
  },
  removeArtist: (id: string) => {
    return getInstance().delete<void>(`${artistsEndpoint}/${id}`)
  },
}
