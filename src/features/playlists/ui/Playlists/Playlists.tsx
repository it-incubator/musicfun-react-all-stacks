import { PageTitle } from "@/common"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { PlaylistQueryKey, playlistsApi } from "../../api/playlistsApi"
import { AddPlaylistForm } from "./AddPlaylistForm/AddPlaylistForm.tsx"
import s from "./Playlists.module.css"
import { PlaylistsList } from "./PlaylistsList/PlaylistsList.tsx"
import { PlaylistTypeSwitcher } from "./PlaylistTypeSwitcher/PlaylistTypeSwitcher.tsx"

export type PlaylistType = "all" | "my"

export const Playlists = () => {
  const [type, setType] = useState<PlaylistType>("all")

  const { data, isPending } = useQuery({
    queryKey: [PlaylistQueryKey, type],
    queryFn: () => (type === "all" ? playlistsApi.getPlaylists() : playlistsApi.getMyPlaylists()),
  })

  return (
    <>
      <PageTitle>Страница с плейлистами</PageTitle>
      <div className={"layout"}>
        <AddPlaylistForm />
        <div className={s.typeSwitcherWrapper}>
          <PlaylistTypeSwitcher type={type} setType={setType} />
        </div>
        {isPending ? <span>Loading...</span> : <PlaylistsList playlists={data?.data.data || []} />}
      </div>
    </>
  )
}
