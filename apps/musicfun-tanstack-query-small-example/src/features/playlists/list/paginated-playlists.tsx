import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getClient } from '../../../shared/api/client.ts'
import { useEffect, useState } from 'react'
import { Pagination } from '@/shared/ui/pagination/pagination.tsx'
import { useMeQuery } from '../../auth/api/use-me.query.ts'
import { PlaylistCover } from '../playlist-cover/playlist-cover.tsx'
import { playlistListKey, usePlaylistsQuery } from '../api/use-playlists-query.tsx'
import type { SchemaGetPlaylistOutput, SchemaGetPlaylistsOutput } from '../../../shared/api/schema.ts'
import { getSharedSocket } from '../../../shared/api/socket.ts'
import styles from './paginated-playlists.module.css'

type Props = {
  classNames?: string
  userId?: string
  onPlaylistSelected?: (playlistId: string) => void
}

export type PlaylistCreatedEventPayload = SchemaGetPlaylistOutput

export const PlaylistCreatedEventName = 'tracks.playlist-created'
export type PlaylistCreatedEvent = {
  type: typeof PlaylistCreatedEventName
  payload: PlaylistCreatedEventPayload
}

export const PaginatedPlaylists = ({ userId, onPlaylistSelected, classNames }: Props) => {
  const [search, setSearch] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const { data: meData } = useMeQuery()
  const query = usePlaylistsQuery(search, pageNumber, userId)

  const queryClient = useQueryClient()

  useEffect(() => {
    const socket = getSharedSocket(import.meta.env.VITE_AUTH_TOKEN)

    socket.on(PlaylistCreatedEventName, (data: PlaylistCreatedEvent) => {
      queryClient.setQueryData(
        playlistListKey({ search, pageNumber: 1, userId: undefined }),
        (oldData: SchemaGetPlaylistsOutput) => {
          return { data: [data.payload.data, ...oldData.data], meta: oldData.meta } as SchemaGetPlaylistsOutput
        },
      )
    })
  }, [])

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
    <div className={classNames}>
      <div>
        <input value={search} onChange={(e) => setSearch(e.currentTarget.value)} placeholder={'search...'} />
      </div>
      <hr />
      <Pagination
        current={pageNumber}
        pagesCount={query.data!.meta.pagesCount || 0}
        changePageNumber={setPageNumber}
        isFetching={query.isFetching}
      />

      <ul>
        {query.data!.data.map((playlist) => (
          <li
            className={styles.cardBox}
            key={playlist.id}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                onPlaylistSelected?.(playlist.id)
              }
            }}
          >
            <div className={styles.row}>
              <PlaylistCover
                images={playlist.attributes.images}
                playlistId={playlist.id}
                editable={playlist.attributes.user.id === meData?.userId}
              />
              {meData?.userId === playlist.attributes.user.id && (
                <button
                  className={styles.deletePlaylistButton}
                  onClick={() => deletePlaylist(playlist.id)}
                  title={'Delete playlist'}
                  aria-label={'Delete playlist'}
                >
                  🗑️
                </button>
              )}
            </div>

            <h3 className={styles.title}>{playlist.attributes.title}</h3>

            <hr />
          </li>
        ))}
      </ul>
    </div>
  )
}
