import { useMeQuery } from '@/features/auth'
import { MOCK_TRACKS, TracksTable, useFetchTracksQuery } from '@/features/tracks'
import { TrackActions } from '@/features/tracks/ui/TrackActions/TrackActions'
import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { Typography } from '@/shared/components'
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

  const { data: me } = useMeQuery()

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
            const userId = track.attributes.user.id
            const isOwner = userId === me?.userId

            return {
              index,
              id: track.id,
              title: track.attributes.title,
              imageSrc: image?.url || noCoverPlaceholder,
              addedAt: track.attributes.addedAt,
              artists: ['Artist 1', 'Artist 2'],
              duration: 100,
              likesCount: track.attributes.likesCount,
              currentUserReaction: track.attributes.currentUserReaction,
              isOwner,
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
              <TrackActions
                reaction={trackRow.currentUserReaction}
                likesCount={trackRow.likesCount}
                trackId={trackRow.id}
                isOwner={trackRow.isOwner}
              />
            )}
          />
        )}
      />
    </PageWrapper>
  )
}
