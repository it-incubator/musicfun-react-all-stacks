import { useState } from 'react'
import { useFetchTracksQuery } from '@/features/tracks/api/tracksApi.ts'
import { TracksList } from '@/features/tracks/ui/TracksList/TracksList.tsx'
import { Pagination } from '@/common/components'

const PAGE_SIZE = 10

export const UserLikedTracks = () => {
  const [page, setPage] = useState(1)
  const { data: tracks } = useFetchTracksQuery({
    pageNumber: page,
    pageSize: PAGE_SIZE,
  })

  const pageCount = tracks?.meta.pagesCount || 0

  return (
    <>
      <div>UserLikedTracks</div>
      <TracksList tracks={tracks} page={page} pageSize={PAGE_SIZE} isReactionMutable />
      <Pagination current={page} pagesCount={pageCount} pageSize={PAGE_SIZE} changePageNumber={setPage} />
    </>
  )
}
