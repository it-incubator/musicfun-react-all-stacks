import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { AddPlaylistForm } from "./AddPlaylistForm/AddPlaylistForm.tsx"
import { PlaylistsList } from "./PlaylistsList/PlaylistsList.tsx"
import { PlaylistTypeSwitcher } from "./PlaylistTypeSwitcher/PlaylistTypeSwitcher.tsx"
import { PlaylistQueryKey, playlistsApi } from "../../api/playlistsApi"
import s from "./Playlists.module.css"

export type PlaylistType = "all" | "my"

export const Playlists = () => {
  const [type, setType] = useState<PlaylistType>("all")

  const { data, isPending } = useQuery({
    queryKey: [PlaylistQueryKey, type],
    queryFn: () => (type === "all" ? playlistsApi.getPlaylists() : playlistsApi.getMyPlaylists()),
  })

  return (
    <div>
      <h1 className={s.heading}>Страница с плейлистами</h1>
      <div className={s.container}>
        <AddPlaylistForm />
        <div className={s.typeSwitcherWrapper}>
          <PlaylistTypeSwitcher type={type} setType={setType} />
        </div>
        {isPending ? <span>Loading...</span> : <PlaylistsList playlists={data?.data.data || []} />}
      </div>
    </div>
  )
}
