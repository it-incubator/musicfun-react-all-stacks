import { useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi.ts'
import s from './PlaylistsPage.module.css'

export const PlaylistsPage = () => {
  const { data } = useFetchPlaylistsQuery()

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <div className={s.items}>
        {data?.data.map((playlist) => {
          return (
            <div className={s.item} key={playlist.id}>
              <div>title: {playlist.attributes.title}</div>
              <div>description: {playlist.attributes.description}</div>
              <div>userName: {playlist.attributes.user.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
