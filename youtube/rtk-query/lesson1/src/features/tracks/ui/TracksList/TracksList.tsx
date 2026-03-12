import type { TrackData } from '@/features/tracks/api/tracksApi.types.ts'
import s from './TracksList.module.css'

type Props = {
  tracks: TrackData[]
}

export const TracksList = ({ tracks }: Props) => {
  const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className={s.list}>
      {tracks.map((track) => {
        const { title, user, attachments, images, publishedAt, isPublished } = track.attributes
        const coverUrl = images.main[0]?.url
        const attachment = attachments[0]
        const fileSizeKb = attachment ? `${Math.max(1, Math.round(attachment.fileSize / 1024))} KB` : null

        return (
          <div key={track.id} className={s.item}>
            <div className={s.visual}>
              {coverUrl ? (
                <img className={s.cover} src={coverUrl} alt={`${title} cover`} />
              ) : (
                <div className={s.coverFallback} aria-hidden="true">
                  <span className={s.coverFallbackText}>MF</span>
                </div>
              )}
            </div>

            <div className={s.body}>
              <div className={s.topline}>
                <p className={s.author}>{user.name}</p>
                <span className={s.status}>{isPublished ? 'Published' : 'Draft'}</span>
              </div>

              <div className={s.meta}>
                <h3 className={s.title}>{title}</h3>
                <p className={s.fileMeta}>
                  {attachment?.originalName ?? 'No audio file'}
                  {fileSizeKb ? ` | ${fileSizeKb}` : ''}
                </p>
              </div>

              <div className={s.details}>
                <span>Released {dateFormatter.format(new Date(publishedAt))}</span>
                <span>Track ID {track.id.slice(0, 8)}</span>
              </div>

              <div className={s.playerWrap}>
                {attachment ? <audio controls src={attachment.url} /> : <p className={s.empty}>No file available</p>}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
