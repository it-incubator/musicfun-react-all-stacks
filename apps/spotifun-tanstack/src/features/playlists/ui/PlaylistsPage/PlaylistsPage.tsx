import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { playlistsKey } from "@/common/apiEntities"
import { Pagination, SearchInput } from "@/common/components"
import { useDebounceValue } from "@/common/hooks"
import { playlistsApi } from "../../api/playlistsApi.ts"
import { PlaylistsList } from "./PlaylistsList/PlaylistsList.tsx"

export const PlaylistsPage = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(4)

  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounceValue(search)

  const { data, isPending } = useQuery({
    queryKey: [playlistsKey, pageNumber, pageSize, debouncedSearch],
    queryFn: () => playlistsApi.fetchPlaylists({ search, pageNumber, pageSize }),
  })

  const changePageSize = (size: number) => {
    setPageSize(size)
    setPageNumber(1)
  }

  const playlists = (data?.data.data || []).slice().sort((a, b) => a.attributes.order - b.attributes.order)

  return (
    <>
      <SearchInput
        search={search}
        setSearch={setSearch}
        isPending={isPending}
        placeholder="Поиск по названию плейлиста"
      />
      <PlaylistsList playlists={playlists} />
      <Pagination
        current={pageNumber}
        pagesCount={data?.data.meta.pagesCount || 0}
        pageSize={pageSize}
        changePageNumber={setPageNumber}
        changePageSize={changePageSize}
      />
    </>
  )
}
