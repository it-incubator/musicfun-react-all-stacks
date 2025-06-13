import { PauseIcon } from "@/common/icons/PauseIcon/PauseIcon.tsx"
import { PlayIcon } from "@/common/icons/PlayIcon/PlayIcon.tsx"
import { usePlayer } from "@/features/player/lib/hooks/usePlayer.ts"
import type { PlayerLogicTrack } from "@/features/player/model/PlayerLogic.ts"
import type { BaseAttributes, TrackDetails } from "@it-incubator/spotifun-api-sdk"

type Props<T extends BaseAttributes> = {
  track: TrackDetails<T>
}

export const TrackPlayer = <T extends BaseAttributes>({ track }: Props<T>) => {
  //const { attachments } = track.attributes
  const playerBeatDTO: PlayerLogicTrack = {
    id: track.id,
    artist: "",
    title: track.attributes.title,
    format: "mp3",
    url: track.attributes.attachments[0].url,
    type: "beat",
    images: {
      thumbnail: track.attributes.images.main[0]?.url,
      middle: track.attributes.images.main[1]?.url,
      original: track.attributes.images.main[2]?.url,
    },
  }

  const [player, isPlayingMe] = usePlayer(false, playerBeatDTO)

  const playHandler = () => {
    if (isPlayingMe) {
      player.pause()
    } else {
      player.play(playerBeatDTO)
    }
  }

  return <div onClick={playHandler}>{isPlayingMe ? <PauseIcon /> : <PlayIcon />}</div>
}
