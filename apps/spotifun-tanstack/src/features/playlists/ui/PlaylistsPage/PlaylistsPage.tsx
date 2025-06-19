import { playlistsKey } from "@/common/apiEntities"
import { PageTitle, Pagination, SearchInput } from "@/common/components"
import { useDebounceValue } from "@/common/hooks"
import { playlistsApi } from "../../api/playlistsApi.ts"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { AddPlaylistForm } from "./AddPlaylistForm/AddPlaylistForm.tsx"
import { PlaylistsList } from "./PlaylistsList/PlaylistsList.tsx"
import s from "./PlaylistsPage.module.css"
import { PlaylistTypeSwitcher } from "./PlaylistTypeSwitcher/PlaylistTypeSwitcher.tsx"

export type PlaylistType = "all" | "my"

export const PlaylistsPage = () => {
  const [type, setType] = useState<PlaylistType>("all")
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(4)

  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounceValue(search)

  const { data, isPending } = useQuery({
    queryKey: [playlistsKey, type, pageNumber, pageSize, debouncedSearch],
    queryFn: () =>
      type === "all" ? playlistsApi.fetchPlaylists({ search, pageNumber, pageSize }) : playlistsApi.fetchMyPlaylists(),
  })

  const changePageSize = (size: number) => {
    setPageSize(size)
    setPageNumber(1)
  }

  const playlists = (data?.data.data || []).slice().sort((a, b) => a.attributes.order - b.attributes.order)
  // @ts-expect-error сдеалть 2 отдельных хука
  const meta = type === "all" ? data?.meta : undefined

  return (
    <>
      <PageTitle>Страница с плейлистами</PageTitle>
      <AddPlaylistForm />
      <div className={s.typeSwitcherWrapper}>
        <PlaylistTypeSwitcher type={type} setType={setType} />
      </div>
      {type === "all" && (
        <SearchInput
          search={search}
          setSearch={setSearch}
          isPending={isPending}
          title="Поиск по названию плейлиста"
          placeholder="Введите название плейлиста"
        />
      )}
      {meta && (
        <>
          <Pagination
            current={pageNumber}
            pagesCount={meta.pagesCount}
            pageSize={pageSize}
            changePageNumber={setPageNumber}
            changePageSize={changePageSize}
          />
        </>
      )}
      <PlaylistsList playlists={playlists} />
    </>
  )
}
