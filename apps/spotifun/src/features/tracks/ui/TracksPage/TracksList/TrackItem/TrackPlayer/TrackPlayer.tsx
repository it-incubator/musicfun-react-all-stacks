import { PauseIcon, PlayIcon } from "@/common/icons"
import { usePlayer } from "@/features/player/lib/hooks/usePlayer.ts"
import type { BaseAttributes, TrackDetails } from "@it-incubator/spotifun-api-sdk"
import { type MouseEvent } from "react"

type Props<T extends BaseAttributes> = {
  track: TrackDetails<T>
}

export const TrackPlayer = <T extends BaseAttributes>({ track }: Props<T>) => {
  const [player, isPlayingMe] = usePlayer(false, track)

  const playHandler = (e: MouseEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (isPlayingMe) {
      player.pause()
    } else {
      player.play(track)
    }
  }

  return <div onClick={playHandler}>{isPlayingMe ? <PauseIcon /> : <PlayIcon />}</div>
}
