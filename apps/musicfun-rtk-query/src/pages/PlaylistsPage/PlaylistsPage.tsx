import { useTranslation } from 'react-i18next'

import { PlaylistCard, PlaylistCardSkeleton, useFetchPlaylistsQuery } from '@/features/playlists'
import { Pagination, Typography } from '@/shared/components'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { ContentList, PageWrapper, SearchTags, SearchTextField, SortSelect } from '../common'
import { usePageSearchParams } from '../common/hooks'
import s from './PlaylistsPage.module.css'

export const PlaylistsPage = () => {
  const { t } = useTranslation()

  const { pageNumber, handlePageChange, debouncedSearch, sortBy, sortDirection, tagsIds } =
    usePageSearchParams()

  const { data: playlists, isLoading: isPlaylistsLoading } = useFetchPlaylistsQuery({
    pageNumber,
    sortBy,
    sortDirection,
    search: debouncedSearch,
    ...(tagsIds.length > 0 && { tagsIds }),
  })
  const pagesCount = playlists?.meta.pagesCount || 1

  return (
    <PageWrapper>
      <Typography variant="h2" as="h1" className={s.title}>
        {t('playlists.title.all_playlists')}
      </Typography>
      <div className={s.controls}>
        <div className={s.controlsRow}>
          <SearchTextField placeholder={t('playlists.placeholder.search_playlist')} />
          <SortSelect />
        </div>
        <SearchTags type="tags" className={s.searchTags} />
      </div>

      <ContentList
        data={playlists?.data}
        isLoading={isPlaylistsLoading}
        skeleton={<PlaylistCardSkeleton showReactionButtons />}
        renderItem={(playlist) => {
          const image = getImageByType(playlist.attributes.images, ImageType.MEDIUM)

          return (
            <PlaylistCard
              id={playlist.id}
              title={playlist.attributes.title}
              imageSrc={image?.url}
              description={playlist.attributes.description}
              isShowReactionButtons={true}
              reaction={playlist.attributes.currentUserReaction}
              likesCount={playlist.attributes.likesCount}
            />
          )
        }}
      />

      <Pagination
        className={s.pagination}
        page={pageNumber}
        pagesCount={pagesCount}
        onPageChange={handlePageChange}
      />
    </PageWrapper>
  )
}
