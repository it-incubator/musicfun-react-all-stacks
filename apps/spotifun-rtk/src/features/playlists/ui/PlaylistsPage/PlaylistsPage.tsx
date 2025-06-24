import { useEffect, useState } from "react"

import { Pagination, SearchInput } from "@/common/components"
import { useDebounceValue } from "@/common/hooks"

import { useGetMeQuery } from "@/features/auth/api/auth-api"
import { useFetchPlaylistsQuery } from "../../api/playlistsApi"
import { PlaylistsList } from "./PlaylistsList/PlaylistsList"

export const PlaylistsPage = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(4)
  const [search, setSearch] = useState("")
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
