import { atom } from '@reatom/core'
import type { SchemaGetPlaylistsOutput } from '../../shared/api/schema.ts'
import { getClient } from '../../shared/api/client.ts'

export const list = atom(null as null | SchemaGetPlaylistsOutput, 'list')
  .extend((target) => ({
    // describe things that you want to assign to the current atom
    isLoading: atom(false, `${target.name}.isLoading`),
  }))
  .actions((target) => ({
    async load(page: number) {
      target.isLoading.set(true)
      const response = await getClient().GET(`/playlists`, {
        params: {
          query: {
            pageNumber: page,
          },
        },
      })
      const payload = response.data!
      target.set(payload)
      target.isLoading.set(false)
    },
  }))
