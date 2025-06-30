import { Pagination, SearchInput, Sort, sortByDirection } from "@/common/components"
import { useDebounceValue } from "@/common/hooks"
import { useFetchPlaylistsQuery } from "../../api/playlistsApi"
import { useEffect, useState } from "react"
import { PlaylistsList } from "./PlaylistsList/PlaylistsList"
import { useGetMeQuery } from "@/features/auth/api/auth-api"
import { type SortDirection } from "@/common/components/Sort/SortByDirection.ts"

export const PlaylistsPage = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(4)
  const [search, setSearch] = useState("")

  const [sortDirection, setSortDirection] = useState<SortDirection>("new")

  const [debouncedSearch] = useDebounceValue(search)
  const { data: userData, isLoading: isAuthLoading } = useGetMeQuery()
  const { data, isLoading, refetch } = useFetchPlaylistsQuery(
    {
      search: debouncedSearch,
      pageNumber,
      pageSize,
    },
    {
      skip: isAuthLoading,
    },
  )

  const userLoggedIn = Boolean(userData)

  useEffect(() => {
    if (!isAuthLoading && data) {
      refetch()
    }
  }, [userLoggedIn])

  const changePageSize = (size: number) => {
    setPageSize(size)
    setPageNumber(1)
    setSortDirection("new")
  }

  const changePageNumberHandler = (pageNumber: number) => {
    setPageNumber(pageNumber)
    setSortDirection("new")
  }

  const playlists = (data?.data || []).slice().sort((a, b) => a.attributes.order - b.attributes.order)
  const sortedPlaylists = playlists ? sortByDirection(playlists, sortDirection) : []

  return (
    <>
      <SearchInput
        search={search}
        setSearch={setSearch}
        isPending={isLoading}
        title="Поиск по названию плейлиста"
        placeholder="Введите название плейлиста"
      />
      <Sort setSortDirection={setSortDirection} direction={sortDirection} />
      <PlaylistsList playlists={sortedPlaylists} />
      <Pagination
        current={pageNumber}
        pagesCount={data?.meta.pagesCount || 0}
        pageSize={pageSize}
        changePageNumber={changePageNumberHandler}
        changePageSize={changePageSize}
      />
    </>
  )
}
