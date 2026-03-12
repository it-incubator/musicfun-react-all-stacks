import type { PlaylistAttributes } from '@/features/playlists/api/playlistsApi.types.ts'
import s from './PlaylistDescription.module.css'

type Props = {
  attributes: PlaylistAttributes
}

export const PlaylistDescription = ({ attributes }: Props) => {
  const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className={s.meta}>
      <div className={s.topline}>
        <p className={s.author}>{attributes.user.name}</p>
        <span className={s.badge}>{attributes.tracksCount ?? 0} tracks</span>
      </div>
      <h3 className={s.title}>{attributes.title}</h3>
      <p className={s.description}>{attributes.description || 'No description yet.'}</p>
      <div className={s.stats}>
        <span>{attributes.likesCount} likes</span>
        <span>{attributes.dislikesCount} dislikes</span>
        <span>Updated {dateFormatter.format(new Date(attributes.updatedAt))}</span>
      </div>
    </div>
  )
}
