import { useEffect, useState } from 'react'
import { useDebounceValue } from '@/common/hooks'
import { useGetMeQuery } from '@/features/auth/api/auth-api'
import { useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi.ts'
import { Pagination, SearchInput, Sort, TagsSearch } from '@/common/components'
import { PlaylistsList } from './PlaylistsList/PlaylistsList'
import type { SortBy, SortDirection } from '@/common/types'

export const PlaylistsPage = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(4)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search)

  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [sortBy, setSortBy] = useState<SortBy>('addedAt')

  const [tags, setTags] = useState<string[]>([])
  const [debouncedTags] = useDebounceValue(tags)

  const { data: userData, isLoading: isAuthLoading } = useGetMeQuery()
  const { data, isLoading, refetch } = useFetchPlaylistsQuery(
    {
      search: debouncedSearch,
      pageNumber,
      pageSize,
      sortDirection,
      sortBy,
      tagsIds: debouncedTags,
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

  const playlists = data?.data || []

  return (
    <>
      <SearchInput
        search={search}
        setSearch={setSearch}
        isPending={isLoading}
        title="Search by Playlist Title"
        placeholder="Enter playlist title"
      />
      <TagsSearch setValues={setTags} selectedIds={tags} />
      <Sort setSortDirection={setSortDirection} setSortBy={setSortBy} sortDirection={sortDirection} sortBy={sortBy} />
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
