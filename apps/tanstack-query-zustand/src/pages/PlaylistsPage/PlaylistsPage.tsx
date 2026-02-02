import type { ChangeEvent } from 'react'
import { useCallback, useMemo, useState } from 'react'

import { PlaylistItem } from '@/entities/playlist'
import { useMeQuery } from '@/features/auth/api/use-me.query.ts'
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
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  const hasTokens = !!localStorage.getItem('accessToken') || !!localStorage.getItem('refreshToken')
  const { data: me, isPending: isMeLoading } = useMeQuery()
  const playlistsEnabled = !hasTokens || (!isMeLoading && !!me)
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

  const { data, isPending, isError } = usePlaylists(queryParams, { enabled: playlistsEnabled })
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
      tagsData?.data?.data?.map((tag) => ({
        label: tag.attributes.name,
        value: tag.id,
      })) || [],
    [tagsData?.data?.data]
  )
  const content = useMemo(() => {
    if (!VU.isValid(data?.data)) {
      return null
    }

    if (isPending) {
      return <>{t('common.loading')}</>
    }

    if (isError) {
      return <>{t('playlists.label.load_error')}</>
    }

    if (!VU.isNotEmptyArray(data?.data?.data)) {
      return <>{t('playlists.title.playlists_not_found')}</>
    }

    return (
      <ContentList
        data={data.data.data}
        renderItem={(playlist) => {
          return <PlaylistItem playlist={playlist} />
        }}
      />
    )
  }, [data?.data, isError, isPending, t])

  return (
    <PageWrapper>
      <Typography variant="h2" as="h1" className={s.title}>
        {t('playlists.title.all_playlists')}
      </Typography>
      <div className={s.controls}>
        <div className={s.controlsRow}>
          <SearchTextField
            placeholder={t('playlists.placeholder.search_playlist')}
            onChange={handleSearchChange}
            value={search}
          />
          <SortSelect onChange={handleSortChange} value={sort} />
        </div>
        <Autocomplete
          options={tagsOptions}
          value={hashtags}
          onChange={handleHashtagsChange}
          label={t('tags.label')}
          placeholder={isTagsLoading ? t('common.loading_tags') : t('tags.placeholder')}
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
