import { type ChangeEvent, useMemo } from 'react'
import { useCallback } from 'react'
import { useState } from 'react'

import { PlaylistCard } from '@/features/playlists'
import type { IPlaylistsQuery } from '@/features/playlists/api/use-playlist.query.types.ts'
import { usePlaylists } from '@/features/playlists/api/use-playlists.query.ts'
import { useTags } from '@/features/tags'
import { Autocomplete, Pagination, Typography } from '@/shared/components'
import { useDebounceValue } from '@/shared/hooks'

import { ContentList, PageWrapper, SearchTextField, SortSelect } from '../common'
import type { ISortConfig, SortOption } from './PlaylistsPage.types.ts'
import s from './PlaylistsPage.module.css'

const sortConfig: Record<SortOption, ISortConfig> = {
  newest: { sortBy: 'addedAt', sortDirection: 'desc' },
  oldest: { sortBy: 'addedAt', sortDirection: 'asc' },
  mostLiked: { sortBy: 'likesCount', sortDirection: 'desc' },
  leastLiked: { sortBy: 'likesCount', sortDirection: 'asc' },
} as const

export const PlaylistsPage = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search)
  const [sort, setSort] = useState<SortOption>('newest')
  const [hashtags, setHashtags] = useState<string[]>([])

  const { sortBy, sortDirection } = sortConfig[sort]

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      pageNumber,
      pageSize: 5,
      sortBy,
      sortDirection,
      tagsIds: hashtags,
    }),
    [debouncedSearch, pageNumber, sortBy, sortDirection, hashtags]
  )

  const { data, isPending, isError } = usePlaylists(queryParams)
  const { data: tagsData, isPending: isTagsLoading } = useTags('')

  const resetPage = useCallback(() => {
    setPageNumber(1)
  }, [])

  const handleSortChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value as SortOption
      setSort(value)
      resetPage()
    },
    [resetPage]
  )

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value)
      resetPage()
    },
    [resetPage]
  )

  const handlePageChange = useCallback((page: IPlaylistsQuery['pageNumber']) => {
    setPageNumber(page)
  }, [])

  const handleHashtagsChange = useCallback(
    (tags: IPlaylistsQuery['tagsIds']) => {
      setHashtags(tags || [])
      resetPage()
    },
    [resetPage]
  )

  let content

  if (isPending) {
    content = <span>Loading...</span>
  } else if (isError) {
    content = <span>Playlist loading error. Please try again later.</span>
  } else if (data?.data) {
    content = (
      <>
        <ContentList
          data={data.data!.data}
          renderItem={(playlist) => (
            <PlaylistCard
              id={playlist.id}
              title={playlist.attributes.title}
              images={playlist.attributes.images}
              description={playlist.attributes.description}
              isShowReactionButtons={true}
              reaction={playlist.attributes.currentUserReaction}
              onLike={() => {}}
              onDislike={() => {}}
              likesCount={playlist.attributes.likesCount}
            />
          )}
        />
        <Pagination
          className={s.pagination}
          page={pageNumber}
          pagesCount={data.data.meta.pagesCount || 1}
          onPageChange={handlePageChange}
        />
      </>
    )
  }

  return (
    <PageWrapper>
      <Typography variant="h2" as="h1" className={s.title}>
        All Playlists
      </Typography>
      <div className={s.controls}>
        <div className={s.controlsRow}>
          <SearchTextField
            placeholder="Search playlists"
            onChange={handleSearchChange}
            value={search}
          />
          <SortSelect onChange={handleSortChange} value={sort} />
        </div>
        <Autocomplete
          options={
            tagsData?.data?.map((tag) => ({
              label: tag.name,
              value: tag.id,
            })) || []
          }
          value={hashtags}
          onChange={handleHashtagsChange}
          label="Hashtags"
          placeholder={isTagsLoading ? 'Loading tags...' : 'Search by hashtags'}
          disabled={isTagsLoading}
          className={s.autocomplete}
        />
      </div>
      {content}
    </PageWrapper>
  )
}
