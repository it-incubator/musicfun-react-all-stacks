import { queryClient } from "@/main.tsx"
import type { ChangeEvent } from "react"
import { toast } from "react-toastify"
import { useMutation } from "@tanstack/react-query"
import s from "./PlaylistCover.module.css"
import noCover from "../../../../../../../assets/img/no-cover.png"
import { PlaylistQueryKey, playlistsApi } from "../../../../../api/playlistsApi.ts"
import type { Playlist } from "../../../../../api/playlistsApi.types.ts"

type Props = {
  playlist: Playlist
}

export const PlaylistCover = ({ playlist }: Props) => {
  const { mutate } = useMutation({
    mutationFn: playlistsApi.uploadPlaylistCover,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PlaylistQueryKey] })
    },
  })

  const uploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast("Загрузите изображение", { theme: "colored", type: "error" })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast("Файл слишком большой (макс. 5 МБ).")
      return
    }

    mutate({ playlistId: playlist.id, file })
  }

  return (
    <div className={s.container}>
      <img
        src={playlist.attributes.images.main.length ? playlist.attributes.images.main[0].url : noCover}
        alt={"no cover image"}
        className={s.cover}
      />
      <div>
        <input type="file" accept="image/*" onChange={uploadHandler} />
      </div>
    </div>
  )
}
