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

  if (isLoading) {
    return (
      <main className="page-shell">
        <div className="page-content">
          <p className="empty-state">Loading playlists...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <div className="page-content">
        <section className="page-hero">
          <div className="page-hero-grid">
            <div>
              <p className="page-eyebrow">Playlist catalog</p>
              <h1 className="page-title">
                Build and browse <span className="page-title-accent">your collections</span>
              </h1>
              <p className="page-copy">
                Search by title, flip through pages, and manage each playlist in the same polished card system as the
                tracks archive.
              </p>
            </div>

            <aside className="page-panel">
              <p className="page-panel-label">Filters</p>
              <input
                className="field"
                type="search"
                placeholder="Search playlist by title"
                value={search}
                onChange={searchPlaylistHandler}
              />
              <p className="page-panel-copy">
                Showing {data?.meta.totalCount ?? 0} playlists with paginated navigation.
              </p>
            </aside>
          </div>
        </section>

        <section className="page-section" aria-labelledby="playlists-list-title">
          <div className="page-section-head">
            <h2 id="playlists-list-title" className="page-section-title">
              Playlists in focus
            </h2>
            <p className="page-section-text">
              Covers, description, reaction stats, and editing controls stay visible without leaving the grid.
            </p>
          </div>

          <div className={s.container}>
            <PlaylistsList isPlaylistsLoading={isLoading} playlists={data?.data || []} />
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pagesCount={data?.meta.pagesCount || 1}
              pageSize={pageSize}
              changePageSize={changePageSizeHandler}
            />
          </div>
        </section>
      </div>
    </main>
  )
}
