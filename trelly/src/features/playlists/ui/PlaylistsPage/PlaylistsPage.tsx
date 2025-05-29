import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Layout, Loader, PageTitle } from "@/common/components"
import { PlaylistQueryKey, playlistsApi } from "../../api/playlistsApi.ts"
import { AddPlaylistForm } from "./AddPlaylistForm/AddPlaylistForm.tsx"
import { PlaylistsList } from "./PlaylistsList/PlaylistsList.tsx"
import { PlaylistTypeSwitcher } from "./PlaylistTypeSwitcher/PlaylistTypeSwitcher.tsx"
import s from "./PlaylistsPage.module.css"

export type PlaylistType = "all" | "my"

export const PlaylistsPage = () => {
  const [type, setType] = useState<PlaylistType>("all")

  const { data, isPending } = useQuery({
    queryKey: [PlaylistQueryKey, type],
    queryFn: () => (type === "all" ? playlistsApi.fetchPlaylists() : playlistsApi.fetchMyPlaylists()),
  })

  return (
    <Layout>
      <PageTitle>Страница с плейлистами</PageTitle>
      <AddPlaylistForm />
      <div className={s.typeSwitcherWrapper}>
        <PlaylistTypeSwitcher type={type} setType={setType} />
      </div>
      {isPending ? <Loader /> : <PlaylistsList playlists={data?.data.data || []} />}
    </Layout>
  )
}
