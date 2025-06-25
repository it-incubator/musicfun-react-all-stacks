import { useFetchTracksQuery } from "../../api/tracksApi.ts"

const PAGE_SIZE = 10

export const useFetchTracks = ({ page }: { page: number }) => {
  const { data, isFetching, isLoading } = useFetchTracksQuery({
    pageNumber: page,
    pageSize: PAGE_SIZE,
  })

  const hasNextPage = data && data?.meta.totalCount / PAGE_SIZE > page

  return { tracks: data?.data, isFetching, isLoading, hasNextPage }
}
