import { useState } from 'react'
import { TracksList } from '@/features/tracks/ui/TracksList/TracksList.tsx'
import { Pagination } from '@/common/components'
import { useFetchTracksQuery } from '@/features/tracks/api/tracksApi.ts'

const PAGE_SIZE = 10

export const UserLikedTracks = () => {
  const [page, setPage] = useState(1)
  const { data } = useFetchTracksQuery({
    pageNumber: page,
    pageSize: PAGE_SIZE,
  })

  return (
    <>
      <div>UserLikedTracks</div>
      <TracksList tracks={data?.data} page={page} pageSize={PAGE_SIZE} isReactionMutable />
      <Pagination
        current={page}
        pagesCount={data?.meta.pagesCount || 0}
        pageSize={PAGE_SIZE}
        changePageNumber={setPage}
      />
    </>
  )
}
