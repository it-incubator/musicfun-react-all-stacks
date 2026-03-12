import type { PlaylistData } from '@/features/playlists/api/playlistsApi.types.ts'
import { PlaylistCover } from '@/features/playlists/ui/PlaylistItem/PlaylistCover/PlaylistCover.tsx'
import { PlaylistDescription } from '@/features/playlists/ui/PlaylistItem/PlaylistDescription/PlaylistDescription.tsx'
import s from './PlaylistItem.module.css'

type Props = {
  playlist: PlaylistData
  deletePlaylistHandler: (playlistId: string) => void
  editPlaylistHandler: (playlist: PlaylistData) => void
}

export const PlaylistItem = ({ playlist, editPlaylistHandler, deletePlaylistHandler }: Props) => {
  return (
    <article className={`${s.card} surface-card`}>
      <PlaylistCover playlistId={playlist.id} images={playlist.attributes.images} />
      <PlaylistDescription attributes={playlist.attributes} />
      <div className={s.actions}>
        <button className="button-ghost" onClick={() => deletePlaylistHandler(playlist.id)}>
          Delete
        </button>
        <button className="button" onClick={() => editPlaylistHandler(playlist)}>
          Update
        </button>
      </div>
    </article>
  )
}
