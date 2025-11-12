import trackDefaultCover from '@/assets/img/track-default-cover.jpg'
import type { BaseAttributes, TrackDetails } from '@/modules/musicstaff/tracks/api/tracksApi.types.ts'

import s from './PlayerDescription.module.scss'

type Props<T extends BaseAttributes> = {
  track: TrackDetails<T>
  mobMode: boolean
}

export const PlayerDescription = <T extends BaseAttributes>({ track, mobMode }: Props<T>) => {
  const { title, images } = track.attributes

  const mediumUrl = images.main?.find((img) => img.type === 'medium')?.url ?? trackDefaultCover
  const thumbnailUrl = images.main?.find((img) => img.type === 'thumbnail')?.url ?? trackDefaultCover

  return (
    <div className={mobMode ? s.trackDescrMob : s.trackDescr}>
      <img
        className={mobMode ? s.trackCoverMob : s.trackCover}
        src={mobMode ? mediumUrl : thumbnailUrl}
        alt={`${title} cover`}
      />
      <div className={s.trackText}>
        <p className={s.trackTitle}>{title}</p>
        {/*<p className={s.trackArtist}>{artist}</p>*/}
      </div>
    </div>
  )
}
