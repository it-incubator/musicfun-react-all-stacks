import s from "./ArtistItem.module.css"
import { useDeleteArtistMutation } from "@/features/artists/api/artistsApi.ts"
import type { Artist } from "@/features/artists/api/artistsApi.types.ts"
import { useAppDispatch } from "@/common/hooks"
import { setError } from "@/app/model/errorSlice.ts"

type Props = {
  artist: Artist
}

export const ArtistItem = ({ artist }: Props) => {
  const dispatch = useAppDispatch()
  const { name, id } = artist
  const [deleteArtist, { isLoading }] = useDeleteArtistMutation()
  const deleteHandler = () => {
    deleteArtist(id)
      .unwrap()
      .catch((error) => {
        dispatch(setError(error.data.message))
      })
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
