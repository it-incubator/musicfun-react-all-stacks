import { uploadCover } from "@/common/utils"
import { useUploadPlaylistCoverMutation } from "../../../../../api/playlistsApi"
import type { Playlist } from "../../../../../api/playlistsApi.types"
import noCover from "@/assets/img/no-cover.png"
import type { ChangeEvent } from "react"
import s from "./PlaylistCover.module.css"

type Props = {
  playlist: Playlist
  editable?: boolean
}

export const PlaylistCover = ({ playlist, editable = false }: Props) => {
  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()

  const uploadCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {
    uploadCover({
      event,
      maxSize: 5 * 1024 * 1024,
      onSuccess: (file) => {
        uploadPlaylistCover({ playlistId: playlist.id, file })
          .unwrap()
          .catch((err) => console.log("Ошибка при загрузке изображения", err))
      },
    })
  }

  // TODO: Заменил обработчик ошибок на консольлог. Добавить новый обработчик.

  const originalCover = playlist.attributes.images.main?.find((img) => img.type === "original")

  return (
    <div className={s.container}>
      <img src={originalCover ? originalCover.url : noCover} alt={"no cover image"} className={s.cover} />
      {editable && (
        <div>
          <input type="file" accept="image/jpeg,image/png,image/gif" onChange={uploadCoverHandler} />
        </div>
      )}
    </div>
  )
}
