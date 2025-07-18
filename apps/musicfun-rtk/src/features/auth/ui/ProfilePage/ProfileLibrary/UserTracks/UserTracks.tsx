import { useGetMeQuery } from '@/features/auth/api/auth-api.ts'
import { useState } from 'react'
import { Pagination } from '@/common/components'
import { TracksList } from '@/features/tracks/ui/TracksList/TracksList.tsx'
import { useFetchTracksRegular } from '@/features/tracks/lib/hooks/useFetchTracks.ts'

const PAGE_SIZE = 8

export const UserTracks = () => {
  const [page, setPage] = useState(1)

  const { data: userInfo } = useGetMeQuery()
  const { tracks, pageCount } = useFetchTracksRegular({
    pageNumber: page,
    pageSize: PAGE_SIZE,
    userId: userInfo?.userId,
    includeDrafts: true,
  })

  return (
    <>
      <div>UserTracks</div>
      <button style={{ width: '200px', marginInline: 'auto' }}>Upload Song</button>
      <TracksList tracks={tracks} page={page} pageSize={PAGE_SIZE} />
      <Pagination current={page} pagesCount={pageCount} pageSize={PAGE_SIZE} changePageNumber={setPage} />
    </>
  )
}
