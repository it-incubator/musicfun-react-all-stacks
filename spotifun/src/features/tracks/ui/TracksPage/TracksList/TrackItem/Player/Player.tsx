import { usePlayer } from "@/features/player/lib/hooks/usePlayer.ts"
import type { PlayerLogicTrack } from "@/features/player/model/PlayerLogic.ts"
import type { BaseAttributes, TrackDetails } from "@/features/tracks/api/tracksApi.types.ts"

type Props<T extends BaseAttributes> = {
  track: TrackDetails<T>
}

// return (
//   <div>
//     {attachments.length > 0 ? (
//       <audio controls src={attachments[0].url}></audio>
//     ) : (
//       <h3 style={{ color: "red" }}>no file</h3>
//     )}
//   </div>
// )

export const Player = <T extends BaseAttributes>({ track }: Props<T>) => {
  const { attachments } = track.attributes
  const playerBeatDTO: PlayerLogicTrack = {
    id: track.id,
    artist: "",
    title: track.attributes.title,
    format: "mp3",
    url: track.attributes.attachments[0].url,
    type: "beat",
    images: {
      thumbnail: track.attributes.images.main[0].url,
      middle: track.attributes.images.main[1].url,
      original: track.attributes.images.main[2].url,
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

  return (
    <div>
      <button onClick={playHandler}>play</button>
      <button>pause</button>
    </div>
  )
}
