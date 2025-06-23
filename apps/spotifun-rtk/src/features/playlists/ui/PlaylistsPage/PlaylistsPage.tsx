import { Pagination, SearchInput } from "@/common/components"
import { useDebounceValue } from "@/common/hooks"
import { useFetchPlaylistsQuery } from "../../api/playlistsApi"
import { useState } from "react"
import { PlaylistsList } from "./PlaylistsList/PlaylistsList"

export const PlaylistsPage = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(4)

  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounceValue(search)

  const { data, isLoading } = useFetchPlaylistsQuery({
    search: debouncedSearch,
    pageNumber,
    pageSize,
  })

  const changePageSize = (size: number) => {
    setPageSize(size)
    setPageNumber(1)
  }

  const playlists = (data?.data || []).slice().sort((a, b) => a.attributes.order - b.attributes.order)

  return (
    <>
      <SearchInput
        search={search}
        setSearch={setSearch}
        isPending={isLoading}
        title="Поиск по названию плейлиста"
        placeholder="Введите название плейлиста"
      />
      <PlaylistsList playlists={playlists} />
      <Pagination
        current={pageNumber}
        pagesCount={data?.meta.pagesCount || 0}
        pageSize={pageSize}
        changePageNumber={setPageNumber}
        changePageSize={changePageSize}
      />
    </>
  )
}
