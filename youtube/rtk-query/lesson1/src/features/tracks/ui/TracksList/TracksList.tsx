import type { TrackData } from '@/features/tracks/api/tracksApi.types.ts'
import s from './TracksList.module.css'

type Props = {
  tracks: TrackData[]
}

export const TracksList = ({ tracks }: Props) => {
  return (
    <div className={s.list}>
      {tracks.map((track) => {
        const { title, user, attachments, images } = track.attributes
        const coverUrl = images.main[0]?.url

        return (
          <div key={track.id} className={s.item}>
            <div className={s.visual}>
              {coverUrl ? (
                <img className={s.cover} src={coverUrl} alt={`${title} cover`} />
              ) : (
                <div className={s.coverFallback} aria-hidden="true">
                  <span className={s.coverFallbackText}>No cover</span>
                </div>
              )}
            </div>

            <div className={s.body}>
              <div className={s.meta}>
                <p className={s.kicker}>Track</p>
                <h3 className={s.title}>{title}</h3>
                <p className={s.author}>{user.name}</p>
              </div>

              <div className={s.playerWrap}>
                {attachments.length ? (
                  <audio controls src={attachments[0].url} />
                ) : (
                  <p className={s.empty}>No file available</p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
