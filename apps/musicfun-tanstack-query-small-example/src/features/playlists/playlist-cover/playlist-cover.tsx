import s from './playlist-cover.module.css'
import noCover from '../../../assets/img/no-cover.png'
import type { components } from '@/shared/api'
import type { ChangeEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getClient } from '@/shared/api'

type PlaylistImagesOutputDTO = components['schemas']['PlaylistImagesOutputDTO']

type Props = {
  editable?: boolean
  images: PlaylistImagesOutputDTO
  playlistId: string
}

export const PlaylistCover = ({ images, playlistId, editable = false }: Props) => {
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: (args: { file: File }) => {
      const { file } = args
      const formData = new FormData()
      formData.append('file', file)
      return getClient().POST('/playlists/{playlistId}/images/main', {
        params: { path: { playlistId } },
        body: formData as unknown as { file: string },
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['playlists'] }),
    // onError: (err: unknown) => showErrorToast("Ошибка при загрузке изображения", err),
  })

  const uploadCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    mutate({ file: file! })
  }

  const originalCover = images.main?.find((img) => img.type === 'original')

  return (
    <div className={s.container}>
      <img src={originalCover ? originalCover.url : noCover} alt={'no cover image'} className={s.cover} />
      {editable && (
        <div>
          <input type="file" accept="image/jpeg,image/png,image/gif" onChange={uploadCoverHandler} />
        </div>
      )}
    </div>
  )
}
