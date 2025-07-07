import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { playlistsKey } from '@/common/apiEntities'
import { Pagination, SearchInput } from '@/common/components'
import { useDebounceValue } from '@/common/hooks'
import { PlaylistsList } from './PlaylistsList/PlaylistsList.tsx'
import { getClient } from '@/common/api/client.ts'
import type { GetPlaylistsRequestPayload } from '@/modules/musicstaff/playlists/api/playlistsApi.types.ts'

export const PlaylistsPage = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(4)

  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search)

  const { data, isPending } = useQuery({
    queryKey: [playlistsKey, pageNumber, pageSize, debouncedSearch],
    queryFn: async () => {
      const data = await getClient().GET('/playlists', {
        params: {
          query: {
            search: debouncedSearch,
            pageNumber: pageNumber,
            pageSize: pageSize,
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

  const playlists = data?.data?.data || []

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
        pagesCount={data?.data?.meta.pagesCount || 0}
        pageSize={pageSize}
        changePageNumber={setPageNumber}
        changePageSize={changePageSize}
      />
    </>
  )
}
