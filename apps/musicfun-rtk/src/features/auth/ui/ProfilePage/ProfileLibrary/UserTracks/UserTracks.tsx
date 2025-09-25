import { useGetMeQuery } from '@/features/auth/api/auth-api.ts'
import { useState } from 'react'
import { Pagination } from '@/common/components'
import { TracksList } from '@/features/tracks/ui/TracksList/TracksList.tsx'
import { useFetchTracksQuery } from '@/features/tracks/api/tracksApi.ts'

const PAGE_SIZE = 8

export const UserTracks = () => {
  const [page, setPage] = useState(1)

  const { data: userInfo } = useGetMeQuery()
  const { data } = useFetchTracksQuery({
    pageNumber: page,
    pageSize: PAGE_SIZE,
    userId: userInfo?.userId,
    includeDrafts: true,
  })

  return (
    <>
      <div>UserTracks</div>
      <button style={{ width: '200px', marginInline: 'auto' }}>Upload Song</button>
      <TracksList tracks={data?.data} page={page} pageSize={PAGE_SIZE} />
      <Pagination
        current={page}
        pagesCount={data?.meta.pagesCount || 0}
        pageSize={PAGE_SIZE}
        changePageNumber={setPage}
      />
    </>
  )
}
