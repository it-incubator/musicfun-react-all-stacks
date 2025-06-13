import trackDefaultCover from "@/assets/img/track-default-cover.jpg"
import { PauseIcon, PlayIcon } from "@/common/icons"
import { usePlayer } from "@/features/player/lib/hooks/usePlayer.ts"
import type { PlayerLogicTrack } from "@/features/player/model/PlayerLogic.ts"
import type { BaseAttributes, TrackDetails } from "@it-incubator/spotifun-api-sdk"
import { type MouseEvent } from "react"

type Props<T extends BaseAttributes> = {
  track: TrackDetails<T>
}

export const TrackPlayer = <T extends BaseAttributes>({ track }: Props<T>) => {
  //const { attachments } = track.attributes
  const playerBeatDTO: PlayerLogicTrack = {
    id: track.id,
    artist: "",
    title: track.attributes.title,
    url: track.attributes.attachments[0].url,
    images: {
      thumbnail: track.attributes.images.main[0]?.url ?? trackDefaultCover,
      middle: track.attributes.images.main[1]?.url ?? trackDefaultCover,
      original: track.attributes.images.main[2]?.url ?? trackDefaultCover,
    },
  }

  const [player, isPlayingMe] = usePlayer(false, playerBeatDTO)

  const playHandler = (e: MouseEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (isPlayingMe) {
      player.pause()
    } else {
      player.play(playerBeatDTO)
    }
  }

  return <div onClick={playHandler}>{isPlayingMe ? <PauseIcon /> : <PlayIcon />}</div>
}
