import type { BaseAttributes, TrackDetails } from "@/features/tracks/api/tracksApi.types.ts"

type Props<T extends BaseAttributes> = {
  track: TrackDetails<T>
}

export const Player = <T extends BaseAttributes>({ track }: Props<T>) => {
  const { attachments } = track.attributes

  return (
    <div>
      {attachments.length > 0 ? (
        <audio controls src={attachments[0].url}></audio>
      ) : (
        <h3 style={{ color: "red" }}>no file</h3>
      )}
    </div>
  )
}
