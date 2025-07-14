import { useSearchParams } from 'react-router'

import { PlaylistCard, PlaylistCardSkeleton, useFetchPlaylistsQuery } from '@/features/playlists'
import { Pagination, Typography } from '@/shared/components'
import { useDebounce } from '@/shared/hooks'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { ContentList, PageWrapper, SearchTags, SearchTextField, SortSelect } from '../common'
import s from './PlaylistsPage.module.css'

export const PlaylistsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const debouncedSearch = useDebounce(search, 500)

  const sortBy = searchParams.get('sortBy') as 'addedAt' | 'likesCount'
  const sortDirection = searchParams.get('sortDirection') as 'asc' | 'desc'
  const tagsIds = searchParams.get('tags')?.split(',').filter(Boolean) || []

  const pageNumber = Number(searchParams.get('page')) || 1
  const { data: playlists, isLoading: isPlaylistsLoading } = useFetchPlaylistsQuery({
    pageNumber,
    sortBy: sortBy || 'addedAt',
    sortDirection: sortDirection || 'desc',
    search: debouncedSearch,
    ...(tagsIds.length > 0 && { tagsIds }),
  })
  const pagesCount = playlists?.meta.pagesCount || 1

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      if (page === 1) {
        prev.delete('page')
      } else {
        prev.set('page', page.toString())
      }
      return prev
    })
  }

  return (
    <PageWrapper>
      <Typography variant="h2" as="h1" className={s.title}>
        All Playlists
      </Typography>
      <div className={s.controls}>
        <div className={s.controlsRow}>
          <SearchTextField placeholder="Search playlists" />
          <SortSelect />
        </div>
        <SearchTags className={s.searchTags} />
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
