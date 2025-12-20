import { PageWrapper } from '@/pages/common'
import s from './TrackLyricsPage.module.css'
import { useNavigate, useParams } from 'react-router'
import { useFetchTrackByIdQuery } from '@/features/tracks'
import { ArrowBackIcon } from '@/shared/icons/ArrowBackIcon.tsx'
import { useTranslation } from 'react-i18next'

export const TrackLyricsPage = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: track, isLoading } = useFetchTrackByIdQuery({ trackId: id! })

  const trackText = track?.data.attributes.lyrics || t('tracks.placeholder.no_lyrics')

  return (
    <>
      <PageWrapper className={s.trackLyricsPage}>
        <div>
          <button
            type="button"
            className={s.button}
            onClick={() => {
              navigate(-1)
            }}>
            <ArrowBackIcon />
            {t('tracks.button.go_back')}
          </button>
        </div>
        <div className={s.trackTextWrapper}>
          {!isLoading && <p className={s.trackText}>{trackText}</p>}
        </div>
      </PageWrapper>
    </>
  )
}
