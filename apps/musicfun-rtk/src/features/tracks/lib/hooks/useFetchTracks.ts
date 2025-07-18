import { useFetchTracksQuery, useFetchTracksInfinityQuery } from '../../api/tracksApi.ts'
import type {
  FetchTracksArgs,
  FetchTracksAttributes,
  PaginationType,
  TrackDetails,
} from '@/features/tracks/api/tracksApi.types.ts'
import type { Nullable } from '@/common/types'

const PAGE_SIZE = 10

type InfinityReturn<T extends PaginationType> = {
  tracks?: TrackDetails<FetchTracksAttributes>[]
  isFetching: boolean
  isLoading: boolean
} & (T extends 'offset' ? { hasNextPage: boolean } : { hasNextPage: boolean; nextCursor: Nullable<string> })

type RegularReturn = {
  tracks: TrackDetails<FetchTracksAttributes>[]
  isFetching: boolean
  isLoading: boolean
  totalCount: number
  pageCount: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

type UseFetchTracksOptions<T extends PaginationType> = {
  mode?: 'infinity' | 'regular'
} & FetchTracksArgs<T>

function useFetchTracks<T extends PaginationType>(
  options: UseFetchTracksOptions<T>,
): InfinityReturn<T> | RegularReturn {
  const { mode = 'infinity', ...args } = options

  const queryArgs = {
    ...args,
    pageSize: args.pageSize || PAGE_SIZE,
  } as FetchTracksArgs<T>

  const infinityResult = useFetchTracksInfinityQuery(queryArgs, { skip: mode !== 'infinity' })
  const regularResult = useFetchTracksQuery(queryArgs, { skip: mode !== 'regular' })

  const activeResult = mode === 'infinity' ? infinityResult : regularResult
  const { data, isFetching, isLoading } = activeResult

  const baseResult = {
    tracks: data?.data,
    isFetching,
    isLoading,
  }

  if (mode === 'regular') {
    const pageNumber = 'pageNumber' in args ? args.pageNumber || 1 : 1
    const totalPages = data ? Math.ceil(data.meta.totalCount / PAGE_SIZE) : 0

    return {
      ...baseResult,
      totalCount: data?.meta.totalCount || 0,
      pageCount: data?.meta.pagesCount || 0,
      hasNextPage: pageNumber < totalPages,
      hasPrevPage: pageNumber > 1,
    } as RegularReturn
  }

  if (args.paginationType === 'offset') {
    const offsetArgs = args as FetchTracksArgs<'offset'>
    const pageNumber = offsetArgs.pageNumber || 1
    return {
      ...baseResult,
      hasNextPage: data ? data.meta.totalCount / PAGE_SIZE > pageNumber : false,
    } as unknown as InfinityReturn<T>
  }

  return {
    ...baseResult,
    hasNextPage: !!data?.meta.nextCursor,
    nextCursor: data?.meta.nextCursor,
  } as InfinityReturn<T>
}

export const useFetchTracksRegular = (args: Omit<FetchTracksArgs<'offset'>, 'paginationType'>): RegularReturn =>
  useFetchTracks({ ...args, paginationType: 'offset', mode: 'regular' }) as RegularReturn

export function useFetchTracksInfinity<T extends PaginationType>(
  args: Omit<FetchTracksArgs<T>, 'paginationType'> & { paginationType?: T },
): InfinityReturn<T> {
  const paginationType = ('pageNumber' in args ? 'offset' : 'cursor') as T

  const queryArgs = {
    ...args,
    paginationType,
    mode: 'infinity' as const,
  } as UseFetchTracksOptions<T>

  return useFetchTracks(queryArgs) as InfinityReturn<T>
}
