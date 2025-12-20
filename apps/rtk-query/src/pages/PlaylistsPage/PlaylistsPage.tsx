import { useTranslation } from 'react-i18next'

import { useMeQuery } from '@/features/auth'
import {
  PlaylistActions,
  PlaylistCard,
  PlaylistCardSkeleton,
  useFetchPlaylistsQuery,
} from '@/features/playlists'
import { Pagination, Typography } from '@/shared/components'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { ContentList, PageWithHeader, SearchTags, SearchTextField, SortSelect } from '../common'
import { usePageSearchParams } from '../common/hooks'
import s from './PlaylistsPage.module.css'

export const PlaylistsPage = () => {
  const { t } = useTranslation()
  const { data: me } = useMeQuery()
  const isOwnPlaylist = (userId: string): boolean => me?.userId === userId

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
    <PageWithHeader>
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
              isShowReactionButtons={true}
              reaction={playlist.attributes.currentUserReaction}
              likesCount={playlist.attributes.likesCount}
              userName={playlist.attributes.user.name}
              userId={playlist.attributes.user.id}
              addedAt={playlist.attributes.addedAt}
              shouldShowOwnerName
              shouldShowCreatedDate
              actions={
                isOwnPlaylist(playlist.attributes.user.id) && (
                  <PlaylistActions playlistId={playlist.id} />
                )
              }
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
    </PageWithHeader>
  )
}
