import type { ChangeEvent } from 'react'
import { useCallback, useMemo, useState } from 'react'

import { PlaylistItem } from '@/entities/playlist'
import { usePlaylists } from '@/features/playlists/api/use-playlists.query.ts'
import { useTags } from '@/features/tags'
import {
  PathsPlaylistsGetParametersQuerySortBy,
  PathsPlaylistsGetParametersQuerySortDirection,
  type SchemaGetPlaylistsRequestPayload,
} from '@/shared/api/schema.ts'
import { Autocomplete, Pagination, Typography } from '@/shared/components'
import { useDebounceValue } from '@/shared/hooks'
import { VU } from '@/shared/utils'

import { ContentList, PageWrapper, SearchTextField, SortSelect } from '../common'
import s from './PlaylistsPage.module.css'
import type { ISortConfig, SortOption } from './PlaylistsPage.types.ts'

const PAGE_SIZE = 5
const DEFAULT_PAGE = 1

const sortConfig: Record<SortOption, ISortConfig> = {
  newest: {
    sortBy: PathsPlaylistsGetParametersQuerySortBy.addedAt,
    sortDirection: PathsPlaylistsGetParametersQuerySortDirection.desc,
  },
  oldest: {
    sortBy: PathsPlaylistsGetParametersQuerySortBy.addedAt,
    sortDirection: PathsPlaylistsGetParametersQuerySortDirection.asc,
  },
  mostLiked: {
    sortBy: PathsPlaylistsGetParametersQuerySortBy.likesCount,
    sortDirection: PathsPlaylistsGetParametersQuerySortDirection.desc,
  },
  leastLiked: {
    sortBy: PathsPlaylistsGetParametersQuerySortBy.likesCount,
    sortDirection: PathsPlaylistsGetParametersQuerySortDirection.asc,
  },
} as const

export const PlaylistsPage = () => {
  const [pageNumber, setPageNumber] = useState<number>(DEFAULT_PAGE)
  const [search, setSearch] = useState<string>('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [hashtags, setHashtags] = useState<string[]>([])

  const [debouncedSearch] = useDebounceValue(search)

  const { sortBy, sortDirection } = sortConfig[sort]

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      pageNumber,
      pageSize: PAGE_SIZE,
      sortBy,
      sortDirection,
      tagsIds: hashtags,
    }),
    [debouncedSearch, pageNumber, sortBy, sortDirection, hashtags]
  )

  const { data, isPending, isError } = usePlaylists(queryParams)
  const { data: tagsData, isPending: isTagsLoading } = useTags('')

  const handleSortChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as SortOption

    setSort(value)
    setPageNumber(DEFAULT_PAGE)
  }, [])
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    setPageNumber(DEFAULT_PAGE)
  }, [])
  const handlePageChange = useCallback((page: SchemaGetPlaylistsRequestPayload['pageNumber']) => {
    setPageNumber(page)
  }, [])
  const handleHashtagsChange = useCallback((tags: SchemaGetPlaylistsRequestPayload['tagsIds']) => {
    setHashtags(tags || [])
    setPageNumber(DEFAULT_PAGE)
  }, [])

  const tagsOptions = useMemo(
    () =>
      tagsData?.data?.map((tag) => ({
        label: tag.name,
        value: tag.id,
      })) || [],
    [tagsData?.data]
  )
  const content = useMemo(() => {
    if (!VU.isValid(data?.data)) {
      return null
    }

    if (isPending) {
      return <>Loading...</>
    }

    if (isError) {
      return <>Playlist loading error. Please try again later.</>
    }

    if (!VU.isValidArray(data?.data?.data)) {
      return <>No results found for your search.</>
    }

    return (
      <ContentList
        data={data.data.data}
        renderItem={(playlist) => <PlaylistItem playlist={playlist} />}
      />
    )
  }, [data?.data, isError, isPending])

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
          options={tagsOptions}
          value={hashtags}
          onChange={handleHashtagsChange}
          label="Hashtags"
          placeholder={isTagsLoading ? 'Loading tags...' : 'Search by hashtags'}
          disabled={isTagsLoading}
          className={s.autocomplete}
        />
      </div>
      {content}
      <Pagination
        className={s.pagination}
        page={pageNumber}
        pagesCount={data?.data?.meta.pagesCount || 1}
        onPageChange={handlePageChange}
      />
    </PageWrapper>
  )
}
