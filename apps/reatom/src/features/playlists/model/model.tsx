import { atom } from '@reatom/core'

import { getClient } from '@/shared/api/client.ts'
import type { SchemaGetPlaylistsOutput } from '@/shared/api/schema.ts'

export const playlistsListAtom = atom(null as null | SchemaGetPlaylistsOutput, 'list')
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
