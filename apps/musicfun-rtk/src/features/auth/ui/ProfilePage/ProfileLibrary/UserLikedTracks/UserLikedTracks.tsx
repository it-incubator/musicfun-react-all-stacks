import { useState } from 'react'
import { TracksList } from '@/features/tracks/ui/TracksList/TracksList.tsx'
import { Pagination } from '@/common/components'
import { useFetchTracksRegular } from '@/features/tracks/lib/hooks/useFetchTracks.ts'

const PAGE_SIZE = 10

export const UserLikedTracks = () => {
  const [page, setPage] = useState(1)
  const { tracks, pageCount } = useFetchTracksRegular({
    pageNumber: page,
    pageSize: PAGE_SIZE,
  })

  return (
    <>
      <div>UserLikedTracks</div>
      <TracksList tracks={tracks} page={page} pageSize={PAGE_SIZE} isReactionMutable />
      <Pagination current={page} pagesCount={pageCount} pageSize={PAGE_SIZE} changePageNumber={setPage} />
    </>
  )
}
