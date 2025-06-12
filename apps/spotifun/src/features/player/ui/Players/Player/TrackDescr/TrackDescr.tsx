import type { PlayerLogicTrack } from "../../../../model/PlayerLogic.ts"
import s from "./TrackDescr.module.scss"

type Props = {
  track: PlayerLogicTrack
  mobMode: boolean
}

export const TrackDescr = ({ track, mobMode }: Props) => {
  const { title, images, artist } = track
  return (
    <div className={mobMode ? s.trackDescrMob : s.trackDescr}>
      <img
        className={mobMode ? s.trackCoverMob : s.trackCover}
        src={mobMode ? images.middle : images.thumbnail}
        alt={`${title} cover`}
      />
      <div className={s.trackText}>
        <p className={s.trackArtist}>{artist}</p>
        <p className={s.trackTitle}>{title}</p>
      </div>
    </div>
  )
}
