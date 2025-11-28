import {
  PathsPlaylistsGetParametersQuerySortDirection,
  type PathsPlaylistsTracksGetParametersQuerySortBy,
} from '@/shared/api/schema.ts'

export type SortField = PathsPlaylistsTracksGetParametersQuerySortBy
export type SortOrder = PathsPlaylistsGetParametersQuerySortDirection

export type SortTracksParams = {
  sortBy: SortField
  sortDirection: SortOrder
}
