import { useRemovePlaylist } from '@/features/playlists/lib/hooks/useRemovePlaylist.ts'
import { useUpdatePlaylist } from '@/features/playlists/lib/hooks/useUpdatePlaylist.ts'
import type { Playlist } from '../../../api/playlistsApi.types.ts'
import { EditPlaylistForm } from './EditPlaylistForm/EditPlaylistForm.tsx'
import { PlaylistItem } from './PlaylistItem/PlaylistItem.tsx'
import s from './PlaylistsList.module.css'

type Props = {
  playlists: Playlist[]
}

export const PlaylistsList = ({ playlists }: Props) => {
  const { removePlaylist } = useRemovePlaylist()
  const { playlistId, editPlaylist, register, onSubmit, handleSubmit } = useUpdatePlaylist()

  return (
    <div className={s.container}>
      {playlists.length ? (
        playlists.map((playlist) => {
          const isEditing = playlistId === playlist.id

          return (
            <div key={playlist.id} className={'item'}>
              {isEditing ? (
                <EditPlaylistForm
                  onSubmit={onSubmit}
                  editPlaylist={editPlaylist}
                  handleSubmit={handleSubmit}
                  register={register}
                />
              ) : (
                <PlaylistItem playlist={playlist} editPlaylist={editPlaylist} removePlaylist={removePlaylist} />
              )}
            </div>
          )
        })
      ) : (
        <h1>Плейлисты не созданы</h1>
      )}
    </div>
  )
}
