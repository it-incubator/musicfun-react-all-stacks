import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getClient } from '@/shared/api/client.ts'

import type { IPlaylistsQuery } from './use-playlist.query.types.ts'

export const usePlaylists = ({
  search,
  pageNumber,
  pageSize = 10,
  userId,
  sortBy,
  sortDirection,
  tagsIds,
  trackId,
}: IPlaylistsQuery) => {
  const query = useQuery({
    queryKey: [
      'playlists',
      { search, pageNumber, pageSize, userId, sortBy, sortDirection, tagsIds, trackId },
    ],
    queryFn: () => {
      return getClient().GET('/playlists', {
        params: {
          query: {
            search: search || void 0,
            pageNumber,
            pageSize,
            userId,
            sortBy,
            sortDirection,
            tagsIds: tagsIds && tagsIds.length > 0 ? tagsIds : void 0,
            trackId,
          },
        },
      })
    },
    placeholderData: keepPreviousData,
  })

  return query
}
