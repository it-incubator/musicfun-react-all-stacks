import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'

import { useTrack } from '@/features/tracks/api/use-track.query'
import { PageWithoutHeader } from '@/pages/common'
import { usePageBackgroundColor } from '@/shared/hooks'
import { ArrowBackIcon } from '@/shared/icons'
import { getImageByType } from '@/shared/utils/get-image-by-type'

import s from './TrackLyricsPage.module.css'

export const TrackLyricsPage = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: trackResponse, isLoading, isSuccess } = useTrack(id!)
  const track = trackResponse?.data

  const trackCover = track?.attributes.images && getImageByType(track.attributes.images, 'original')
  const { dominantColor, canvasRef } = usePageBackgroundColor(trackCover?.url, isSuccess)

  const trackText = track?.attributes.lyrics || t('tracks.placeholder.no_lyrics')

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
