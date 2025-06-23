import { PageTitle, Pagination, SearchInput } from "@/common/components"
import { useDebounceValue } from "@/common/hooks"
import { useFetchPlaylistsQuery, useFetchMyPlaylistsQuery } from "../../api/playlistsApi"
import { useState } from "react"
import { AddPlaylistForm } from "./AddPlaylistForm/AddPlaylistForm"
import { PlaylistsList } from "./PlaylistsList/PlaylistsList"
import s from "./PlaylistsPage.module.css"
import { PlaylistTypeSwitcher } from "./PlaylistTypeSwitcher/PlaylistTypeSwitcher"

export type PlaylistType = "all" | "my"

export const PlaylistsPage = () => {
  const [type, setType] = useState<PlaylistType>("all")
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(4)

  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounceValue(search)

  const { data: allPlaylistsData, isLoading: isLoadingAll } = useFetchPlaylistsQuery(
    { search: debouncedSearch, pageNumber, pageSize },
    { skip: type !== "all" },
  )

  const { data: myPlaylistsData, isLoading: isLoadingMy } = useFetchMyPlaylistsQuery(undefined, { skip: type !== "my" })

  const changePageSize = (size: number) => {
    setPageSize(size)
    setPageNumber(1)
  }

  const data = type === "all" ? allPlaylistsData : myPlaylistsData
  const isLoading = type === "all" ? isLoadingAll : isLoadingMy

  const playlists = (data?.data || []).slice().sort((a, b) => a.attributes.order - b.attributes.order)
  const meta = type === "all" ? allPlaylistsData?.meta : undefined

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
          isPending={isLoading}
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
