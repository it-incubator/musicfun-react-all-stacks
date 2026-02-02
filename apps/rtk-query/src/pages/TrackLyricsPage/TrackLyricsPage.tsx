import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'

import { useFetchTrackByIdQuery } from '@/features/tracks'
import { PageWithoutHeader } from '@/pages/common'
import { usePageBackgroundColor } from '@/pages/common/hooks'
import { ArrowBackIcon } from '@/shared/icons/ArrowBackIcon.tsx'
import { ImageType } from '@/shared/types'
import { getImageByType } from '@/shared/utils'

import s from './TrackLyricsPage.module.css'

export const TrackLyricsPage = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: track, isLoading, isSuccess } = useFetchTrackByIdQuery({ trackId: id! })

  const trackCover =
    track?.data.attributes.images &&
    getImageByType(track?.data.attributes.images, ImageType.ORIGINAL)

  const { dominantColor, canvasRef } = usePageBackgroundColor(trackCover?.url, isSuccess)

  const trackText = track?.data.attributes.lyrics || t('tracks.placeholder.no_lyrics')

  return (
    <PageWithoutHeader className={s.trackLyricsPage} backgroundColor={dominantColor}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {dominantColor && (
        <>
          <button
            type="button"
            className={s.button}
            onClick={() => {
              navigate(-1)
            }}>
            <ArrowBackIcon />
            {t('tracks.button.go_back')}
          </button>

          <div className={s.trackTextWrapper}>
            {!isLoading && <p className={s.trackText}>{trackText}</p>}
          </div>
        </>
      )}
    </PageWithoutHeader>
  )
}
