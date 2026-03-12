import defaultCover from '@/assets/images/default-playlist-cover.png'
import type { Images } from '@/common/types'
import { errorToast } from '@/common/utils'
import {
  useDeletePlaylistCoverMutation,
  useUploadPlaylistCoverMutation,
} from '@/features/playlists/api/playlistsApi.ts'
import type { ChangeEvent } from 'react'
import s from './PlaylistCover.module.css'

type Props = {
  playlistId: string
  images: Images
}

export const PlaylistCover = ({ playlistId, images }: Props) => {
  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()
  const [deletePlaylistCover] = useDeletePlaylistCoverMutation()

  const originalCover = images.main.find((img) => img.type === 'original')

  const src = originalCover ? originalCover.url : defaultCover

  const uploadCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const maxSize = 1024 * 1024 // 1 MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

    const file = event.target.files?.length && event.target.files[0]
    if (!file) return

    if (!allowedTypes.includes(file.type)) {
      errorToast('Only JPEG, PNG or GIF images are allowed')
      return
    }

    if (file.size > maxSize) {
      errorToast(`The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`)
      return
    }

    uploadPlaylistCover({ playlistId, file })
  }

  const deleteCoverHandler = () => deletePlaylistCover({ playlistId })

  return (
    <div className={s.wrap}>
      <img src={src} alt="cover" className={s.cover} />
      <label className={s.upload}>
        <span>Upload cover</span>
        <input
          className={s.input}
          type="file"
          accept={'image/jpeg,image/png,image/gif'}
          onChange={uploadCoverHandler}
        />
      </label>
      {originalCover && (
        <button className="button-ghost" onClick={deleteCoverHandler}>
          Delete cover
        </button>
      )}
    </div>
  )
}
