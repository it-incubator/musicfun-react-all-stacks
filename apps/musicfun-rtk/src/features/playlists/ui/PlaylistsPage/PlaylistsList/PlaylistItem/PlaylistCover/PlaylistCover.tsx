import type { ChangeEvent } from 'react'
import { Link, useLocation } from 'react-router'
import noCover from '@/assets/img/no-cover.png'
import { Path } from '@/common/routing'
import { uploadCover } from '@/common/utils'
import type { Playlist } from '@/features/playlists/api/playlistsApi.types.ts'
import {
  useDeletePlaylistCoverMutation,
  useUploadPlaylistCoverMutation,
} from '@/features/playlists/api/playlistsApi.ts'
import s from './PlaylistCover.module.css'

type Props = {
  playlist: Playlist
  editable?: boolean
}

export const PlaylistCover = ({ playlist, editable = false }: Props) => {
  const location = useLocation()

  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()
  const [deletePlaylistCover] = useDeletePlaylistCoverMutation()

  const uploadCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {
    uploadCover({
      event,
      maxSize: 5 * 1024 * 1024,
      onSuccess: (file) => uploadPlaylistCover({ playlistId: playlist.id, file }),
    })
  }

  const deleteCoverHandler = () => {
    deletePlaylistCover({ playlistId: playlist.id })
  }

  const originalCover = playlist.attributes.images.main?.find((img) => img.type === 'original')

  return (
    <div className={s.container}>
      <Link className={'link'} to={`${Path.Playlists}/${playlist.id}`} state={{ from: location.pathname }}>
        <img src={originalCover ? originalCover.url : noCover} alt={'no cover image'} className={s.cover} />
      </Link>
      {editable && (
        <div>
          <input type="file" accept="image/jpeg,image/png,image/gif" onChange={uploadCoverHandler} />
        </div>
      )}
      {originalCover && <button onClick={deleteCoverHandler}>Delete cover</button>}
    </div>
  )
}
