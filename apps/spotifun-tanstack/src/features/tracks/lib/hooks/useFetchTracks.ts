import { tracksKey } from "@/common/apiEntities"
import { tracksApi } from "../../api/tracksApi.ts"
import { useInfiniteQuery } from "@tanstack/react-query"

export const useFetchTracks = () => {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [tracksKey],
    queryFn: ({ pageParam = 1 }) => tracksApi.fetchTracks({ pageNumber: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (response) => {
      const { page, pagesCount } = response.data.meta
      return page < pagesCount ? page + 1 : undefined
    },
  })

  const pages = data?.pages || []

  return { pages, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage }
}
