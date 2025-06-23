import s from "./ArtistItem.module.css"
import { type Artist } from "@it-incubator/spotifun-api-sdk"
import { useDeleteArtistMutation } from "@/features/artists/api/artistsApi.ts"

type Props = {
  artist: Artist
}

export const ArtistItem = ({ artist }: Props) => {
  const { name, id } = artist
  const [deleteArtist, { isLoading }] = useDeleteArtistMutation()
  return (
    <div className={`${s.item} ${s.itemFullwidth} ${s.flexContainer} ${s.container}`}>
      <div>
        <b>Name:</b> <span>{name}</span>
      </div>
      <button
        onClick={() => {
          deleteArtist(id)
        }}
      >
        {isLoading ? "Удаление..." : "Удалить"}
      </button>
    </div>
  )
}
