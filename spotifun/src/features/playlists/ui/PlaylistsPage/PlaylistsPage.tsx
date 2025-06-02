import { playlistsKey } from "@/common/apiEntities"
import { PageTitle, Pagination } from "@/common/components"
import type { PlaylistsResponse } from "@/features/playlists/api/playlistsApi.types.ts"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { playlistsApi } from "../../api/playlistsApi.ts"
import { AddPlaylistForm } from "./AddPlaylistForm/AddPlaylistForm.tsx"
import { PlaylistsList } from "./PlaylistsList/PlaylistsList.tsx"
import s from "./PlaylistsPage.module.css"
import { PlaylistTypeSwitcher } from "./PlaylistTypeSwitcher/PlaylistTypeSwitcher.tsx"

export type PlaylistType = "all" | "my"

export const PlaylistsPage = () => {
  const [type, setType] = useState<PlaylistType>("all")
  const [pageNumber, setPageNumber] = useState(1)

  const { data } = useQuery({
    queryKey: [playlistsKey, type, pageNumber],
    queryFn: () =>
      type === "all"
        ? playlistsApi.fetchPlaylists({
            search: "",
            pageNumber,
          })
        : playlistsApi.fetchMyPlaylists(),
  })

  const playlists = data?.data.data || []
  const meta = type === "all" ? (data?.data as PlaylistsResponse)?.meta : undefined

  return (
    <>
      <PageTitle>Страница с плейлистами</PageTitle>
      <AddPlaylistForm />
      <div className={s.typeSwitcherWrapper}>
        <PlaylistTypeSwitcher type={type} setType={setType} />
      </div>
      <PlaylistsList playlists={playlists} />
      {meta && <Pagination current={pageNumber} pagesCount={meta.pagesCount} onChange={setPageNumber} />}
    </>
  )
}
