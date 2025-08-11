import { Pagination } from '@/common/components'
import { useDebounceValue } from '@/common/hooks'
import { useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi.ts'
import { PlaylistsList } from '@/features/playlists/ui/PlaylistsList/PlaylistsList.tsx'
import { type ChangeEvent, useState } from 'react'
import s from './PlaylistsPage.module.css'

export const PlaylistsPage = () => {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(2)

  const debounceSearch = useDebounceValue(search)
  const { data, isLoading } = useFetchPlaylistsQuery({
    search: debounceSearch,
    pageNumber: currentPage,
    pageSize,
  })

  const changePageSizeHandler = (size: number) => {
    setCurrentPage(1)
    setPageSize(size)
  }

  const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
    setCurrentPage(1)
  }

  if (isLoading) return <h1>Skeleton loader ...</h1>

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <input type="search" placeholder="Search playlist by title" onChange={(e) => searchPlaylistHandler(e)} />
      <PlaylistsList isPlaylistsLoading={isLoading} playlists={data?.data || []} />
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pagesCount={data?.meta.pagesCount || 1}
        pageSize={pageSize}
        changePageSize={changePageSizeHandler}
      />
    </div>
  )
}
