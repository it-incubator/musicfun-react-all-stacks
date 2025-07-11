import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { useQuery } from '@tanstack/react-query'

import type { GetPlaylistsRequestPayload } from '@/modules/musicstaff/playlists/api/playlistsApi.types.ts'
import { getClient } from '@/common/api/client.ts'
import { playlistsKey } from '@/common/apiEntities'
import { Pagination, SearchInput, SortSelect } from '@/common/components'
import { useDebounceValue } from '@/common/hooks'

import { PlaylistsList } from './PlaylistsList/PlaylistsList.tsx'
import s from './PlaylistsPage.module.css'

type SortOption = 'mostLiked' | 'leastLiked' | 'newest' | 'oldest'
type SortBy = 'likesCount' | null //todo: исправить null на publishedAt после обновления API
type SortDirection = 'asc' | 'desc'

interface ISortConfig {
  sortBy: SortBy
  sortDirection: SortDirection
}

//todo: После обновления API исправить null на publishedAt
const sortConfig: Record<SortOption, ISortConfig> = {
  newest: { sortBy: null, sortDirection: 'desc' },
  oldest: { sortBy: null, sortDirection: 'asc' },
  mostLiked: { sortBy: 'likesCount', sortDirection: 'desc' },
  leastLiked: { sortBy: 'likesCount', sortDirection: 'asc' },
} as const

export const PlaylistsPage = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(4)

  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search)

  const [sort, setSort] = useState<SortOption>('newest')

  const { sortBy, sortDirection } = sortConfig[sort]

  const { data, isPending } = useQuery({
    queryKey: [playlistsKey, pageNumber, pageSize, debouncedSearch, sort],
    queryFn: async () => {
      const data = await getClient().GET('/playlists', {
        params: {
          query: {
            search: debouncedSearch,
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortBy: sortBy,
            sortDirection: sortDirection,
          } as GetPlaylistsRequestPayload,
        },
      })
      return data
    },
  })

  const changePageSize = (size: number) => {
    setPageSize(size)
    setPageNumber(1)
  }

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as SortOption
    setSort(value)
    setPageNumber(1)
  }

  const playlists = data?.data?.data || []

  return (
    <>
      <div className={s.controlsRow}>
        <SearchInput
          search={search}
          setSearch={setSearch}
          isPending={isPending}
          placeholder="Поиск по названию плейлиста"
        />
        <SortSelect onChange={handleSortChange} value={sort} />
      </div>
      <PlaylistsList playlists={playlists} />
      <Pagination
        current={pageNumber}
        pagesCount={data?.data?.meta.pagesCount || 0}
        pageSize={pageSize}
        changePageNumber={setPageNumber}
        changePageSize={changePageSize}
      />
    </>
  )
}
