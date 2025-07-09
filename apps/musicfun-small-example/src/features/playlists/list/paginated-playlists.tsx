import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getClient } from '../../../shared/api/client.ts'
import { useState } from 'react'
import { Pagination } from '../../../shared/ui/Pagination/Pagination.tsx'
import { useMeQuery } from '../../auth/api/use-me.query.ts'
import { PlaylistCover } from '../playlist-cover/playlist-cover.tsx'

type Props = {
  userId?: string
  onPlaylistSelected?: (playlistId: string) => void
}
export const PaginatedPlaylists = ({ userId, onPlaylistSelected }: Props) => {
  const [search, setSearch] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const { data: meData } = useMeQuery()

  const query = useQuery({
    queryKey: ['playlists', { search, pageNumber, userId }],
    queryFn: () => {
      return getClient().GET('/playlists', {
        params: {
          query: {
            search: search && undefined,
            pageNumber,
            pageSize: 5,
            userId,
          },
        },
      })
    },
    placeholderData: keepPreviousData,
  })

  const queryClient = useQueryClient()

  const { mutate: deletePlaylist } = useMutation({
    mutationFn: (playlistId: string) =>
      getClient().DELETE('/playlists/{playlistId}', {
        params: {
          path: {
            playlistId,
          },
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] })
    },
    // onError: (err: unknown) =>
    //     showErrorToast("Ошибка при создании плейлиста", err),
  })

  console.log('Playlists rendered')

  if (query.isPending) {
    return <span>Loading...</span>
  }

  if (query.isError) {
    return <span>Error: {query.error.message}</span>
  }

  return (
    <div>
      <div>
        <input value={search} onChange={(e) => setSearch(e.currentTarget.value)} placeholder={'search...'} />
      </div>
      <hr />
      <Pagination
        current={pageNumber}
        pagesCount={query.data.data!.meta.pagesCount || 0}
        changePageNumber={setPageNumber}
        isFetching={query.isFetching}
      />

      <ul>
        {query.data.data!.data.map((playlist) => (
          <li
            key={playlist.id}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                onPlaylistSelected?.(playlist.id)
              }
            }}
          >
            <PlaylistCover
              images={playlist.attributes.images}
              playlistId={playlist.id}
              editable={playlist.attributes.user.id === meData?.data?.userId}
            />
            {playlist.attributes.title}
            {meData?.data?.userId === playlist.attributes.user.id && (
              <button onClick={() => deletePlaylist(playlist.id)}>X</button>
            )}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  )
}
