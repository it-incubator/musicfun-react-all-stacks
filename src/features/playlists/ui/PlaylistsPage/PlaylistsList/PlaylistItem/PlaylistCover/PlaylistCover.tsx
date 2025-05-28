import type { ChangeEvent } from "react"
import { useMutation } from "@tanstack/react-query"
import { queryClient } from "@/main.tsx"
import { showErrorToast } from "@/common/utils"
import { PlaylistQueryKey, playlistsApi } from "../../../../../api/playlistsApi.ts"
import type { Playlist } from "../../../../../api/playlistsApi.types.ts"
import noCover from "@/assets/img/no-cover.png"
import s from "./PlaylistCover.module.css"

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
      showErrorToast("Загрузите изображение")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showErrorToast("Файл слишком большой (макс. 5 МБ)")
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
