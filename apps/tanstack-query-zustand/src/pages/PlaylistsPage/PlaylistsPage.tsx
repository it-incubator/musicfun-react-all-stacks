import { type ChangeEvent, useCallback, useMemo } from 'react'
import { PlaylistItem, PlaylistCardSkeleton } from '@/entities/playlist'
import { useMeQuery } from '@/features/auth/api/use-me.query.ts'
import { usePlaylists } from '@/features/playlists/api/use-playlists.query.ts'
import { useTags } from '@/features/tags'
import {
  PathsPlaylistsGetParametersQuerySortBy,
  PathsPlaylistsGetParametersQuerySortDirection,
  type SchemaGetPlaylistsRequestPayload,
} from '@/shared/api/schema.ts'
import { Autocomplete, Pagination, Typography } from '@/shared/components'
import { usePageSearchParams } from '@/shared/hooks'
import { VU } from '@/shared/utils'
import { useTranslation } from 'react-i18next'

import { ContentList, PageWithHeader, SearchTextField, SortSelect } from '../common'
import s from './PlaylistsPage.module.css'
import type { ISortConfig, SortOption } from './PlaylistsPage.types.ts'

const PAGE_SIZE = 5

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

const getSortOption = (sortBy: string, sortDirection: string): SortOption => {
  if (sortBy === PathsPlaylistsGetParametersQuerySortBy.likesCount) {
    return sortDirection === 'asc' ? 'leastLiked' : 'mostLiked'
  }
  return sortDirection === 'asc' ? 'oldest' : 'newest'
}

export const PlaylistsPage = () => {
  const { t } = useTranslation()

  // Intentionally keep raw localStorage presence check in tanstack-query-zustand:
  // this page only gates the initial me-dependent fetch, not token lifecycle.
  const hasTokens =
    !!localStorage.getItem('musicfun-access-token') ||
    !!localStorage.getItem('musicfun-refresh-token')
  const { data: me, isPending: isMeLoading } = useMeQuery()
  const playlistsEnabled = !hasTokens || (!isMeLoading && !!me)

  const {
    search,
    debouncedSearch,
    sortBy,
    sortDirection,
    tagsIds,
    pageNumber,
    handlePageChange,
    handleSearchChange,
    handleSortChange: handleSortUpdate,
    handleTagsChange,
  } = usePageSearchParams()

  const sort = getSortOption(sortBy, sortDirection)

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      pageNumber,
      pageSize: PAGE_SIZE,
      sortBy: sortBy as PathsPlaylistsGetParametersQuerySortBy,
      sortDirection: sortDirection as PathsPlaylistsGetParametersQuerySortDirection,
      tagsIds,
    }),
    [debouncedSearch, pageNumber, sortBy, sortDirection, tagsIds]
  )

  const { data, isPending, isError } = usePlaylists(queryParams, { enabled: playlistsEnabled })
  const { data: tagsData, isPending: isTagsLoading } = useTags('')

  const onSortChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value as SortOption
      const { sortBy, sortDirection } = sortConfig[value]
      handleSortUpdate(sortBy, sortDirection)
    },
    [handleSortUpdate]
  )

  const onSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleSearchChange(event.target.value)
    },
    [handleSearchChange]
  )

  const tagsOptions = useMemo(
    () =>
      tagsData?.map((tag) => ({
        label: tag.name,
        value: tag.id,
      })) || [],
    [tagsData]
  )

  const content = useMemo(() => {
    if (isPending) {
      return (
        <ContentList
          data={[1, 2, 3, 4, 5]}
          renderItem={() => <PlaylistCardSkeleton showReactionButtons />}
        />
      )
    }

    if (isError) {
      return <>{t('playlists.label.load_error')}</>
    }

    if (!VU.isValid(data?.data) || !VU.isNotEmptyArray(data?.data?.data)) {
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
    <PageWithHeader>
      <Typography variant="h2" as="h1" className={s.title}>
        {t('playlists.title.all_playlists')}
      </Typography>
      <div className={s.controls}>
        <div className={s.controlsRow}>
          <SearchTextField
            placeholder={t('playlists.placeholder.search_playlist')}
            onChange={onSearchChange}
            value={search}
          />
          <SortSelect onChange={onSortChange} value={sort} />
        </div>
        <Autocomplete
          options={tagsOptions}
          value={tagsIds}
          onChange={handleTagsChange}
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
    </PageWithHeader>
  )
}
