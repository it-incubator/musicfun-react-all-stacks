import trackDefaultCover from '@/assets/img/track-default-cover.jpg'
import { tracksKey } from '@/common/apiEntities'
import { uploadCover } from '@/common/utils/uploadCover.ts'
import { tracksApi } from '@/modules/musicstaff/tracks/api/tracksApi.ts'
import { queryClient } from '@/main.tsx'
import { useMutation } from '@tanstack/react-query'
import type { ChangeEvent, MouseEvent } from 'react'
import s from './TrackCover.module.css'
import type { Image2 } from '@/common/types'

type Props = {
  images: Image2
  trackId: string
}

export const TrackCover = ({ trackId, images }: Props) => {
  const { mutate } = useMutation({
    mutationFn: tracksApi.uploadTrackCover,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [tracksKey] }),
  })

  const uploadCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {
    uploadCover({
      event,
      maxSize: 100 * 1024,
      onSuccess: (file) => mutate({ trackId: trackId, file }),
    })
  }

  const stopPropagationHandler = (e: MouseEvent<HTMLInputElement>) => e.stopPropagation()

  const originalCover = images.main?.find((img) => img.type === 'original')

  return (
    <div className={'flex-container-column'}>
      <img src={originalCover ? originalCover.url : trackDefaultCover} alt={'no cover image'} className={s.cover} />
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={uploadCoverHandler}
        onClick={stopPropagationHandler}
      />
    </div>
  )
}
