import { useDeleteArtistMutation } from "../../../../api/artistsApi.ts"
import type { Artist } from "../../../../api/artistsApi.types.ts"
import s from "./ArtistItem.module.css"

type Props = {
  artist: Artist
}

export const ArtistItem = ({ artist }: Props) => {
  const { name, id } = artist
  console.log("123")

  const [deleteArtist, { isLoading }] = useDeleteArtistMutation()

  const deleteHandler = () => {
    deleteArtist(id)
  }

  return (
    <div className={`${s.item} ${s.itemFullwidth} ${s.flexContainer} ${s.container}`}>
      <div>
        <b>Name:</b> <span>{name}</span>
      </div>
      <button onClick={deleteHandler} disabled={isLoading}>
        {isLoading ? "Удаление..." : "Удалить"}
      </button>
    </div>
  )
}
