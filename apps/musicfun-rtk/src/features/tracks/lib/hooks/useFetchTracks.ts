import { useFetchTracksQuery } from '../../api/tracksApi.ts'
import type { FetchTracksArgs } from '@/features/tracks/api/tracksApi.types.ts'

const PAGE_SIZE = 10

export const useFetchTracks = ({ pageNumber, artistsIds, tagsIds }: FetchTracksArgs) => {
  const { data, isFetching, isLoading } = useFetchTracksQuery({
    pageNumber,
    pageSize: PAGE_SIZE,
    tagsIds,
    artistsIds,
  })

  const hasNextPage = data && data?.meta.totalCount / PAGE_SIZE > pageNumber

  return { tracks: data?.data, isFetching, isLoading, hasNextPage }
}
