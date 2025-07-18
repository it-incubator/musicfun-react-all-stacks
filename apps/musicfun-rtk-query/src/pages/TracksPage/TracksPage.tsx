import { MOCK_TRACKS, TracksTable, useFetchTracksQuery } from '@/features/tracks'
import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { DropdownMenu, DropdownMenuTrigger, ReactionButtons, Typography } from '@/shared/components'
import { MoreIcon } from '@/shared/icons'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { PageWrapper, SearchTags, SearchTextField, SortSelect } from '../common'
import { usePageSearchParams } from '../common/hooks'
import s from './TracksPage.module.css'

export const TracksPage = () => {
  const { pageNumber, debouncedSearch, sortBy, sortDirection, tagsIds, artistsIds } =
    usePageSearchParams()

  const { data: tracks } = useFetchTracksQuery({
    pageNumber,
    sortBy,
    sortDirection,
    search: debouncedSearch,
    ...(tagsIds.length > 0 && { tagsIds }),
    ...(artistsIds.length > 0 && { artistsIds }),
  })

  return (
    <PageWrapper>
      <Typography variant="h2" as="h1" className={s.title}>
        All Tracks
      </Typography>
      <div className={s.controls}>
        <div className={s.controlsRow}>
          <SearchTextField placeholder="Search tracks" onChange={() => {}} />
          <SortSelect onChange={() => {}} />
        </div>
        <div className={s.controlsRow}>
          <SearchTags type="tags" />
          <SearchTags type="artists" />
        </div>
      </div>

      <TracksTable
        trackRows={
          tracks?.data?.map((track, index) => {
            const image = getImageByType(track.attributes.images, ImageType.MEDIUM)

            return {
              index,
              id: track.id,
              title: track.attributes.title,
              imageSrc: image?.url || noCoverPlaceholder,
              addedAt: track.attributes.addedAt,
              artists: ['Artist 1', 'Artist 2'],
              duration: 100,
              likesCount: 100,
              dislikesCount: 100,
              currentUserReaction: track.attributes.currentUserReaction,
              onUnReaction: () => {},
              onLike: () => {},
              onDislike: () => {},
              onDelete: () => {},
            }
          }) ?? []
        }
        renderTrackRow={(trackRow) => (
          <TrackRow
            key={trackRow.id}
            trackRow={trackRow}
            playingTrackId={MOCK_TRACKS[0].id}
            playingTrackProgress={20}
            renderActionsCell={() => (
              <>
                <ReactionButtons
                  reaction={trackRow.currentUserReaction}
                  onLike={() => {}}
                  onDislike={() => {}}
                  onUnReaction={() => {}}
                  likesCount={trackRow.likesCount}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreIcon />
                  </DropdownMenuTrigger>
                </DropdownMenu>
              </>
            )}
          />
        )}
      />
    </PageWrapper>
  )
}
