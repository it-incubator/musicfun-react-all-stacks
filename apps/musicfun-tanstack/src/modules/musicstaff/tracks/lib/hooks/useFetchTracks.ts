import { tracksKey } from '@/common/apiEntities'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getClient } from '@/common/api/client.ts'

export const useFetchTracks = () => {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [tracksKey],
    //queryFn: ({ pageParam = 1 }) => tracksApi.fetchTracks({ pageNumber: pageParam }),
    queryFn: () => {
      return getClient().GET('/playlists/tracks', {
        params: {
          query: {
            pageNumber: 1,
            pageSize: 10,
            includeOwnUnpublished: false,
          },
        },
      })
    },
    initialPageParam: 1,
    getNextPageParam: (response) => {
      const { page, pagesCount } = response.data!.meta
      return page < pagesCount ? page + 1 : undefined
    },
  })

  const pages = data?.pages || []

  return { pages, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage }
}
