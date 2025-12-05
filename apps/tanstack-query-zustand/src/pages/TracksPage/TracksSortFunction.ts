import type { SortTracksParams } from '@/pages/TracksPage/tracksPageTypes/TracksPageTypes.ts'
import {
  PathsPlaylistsGetParametersQuerySortDirection,
  PathsPlaylistsTracksGetParametersQuerySortBy,
} from '@/shared/api/schema.ts'

export const tracksSortFunction = (sortValue: string): SortTracksParams => {
  switch (sortValue) {
    case 'newest':
      return {
        sortBy: PathsPlaylistsTracksGetParametersQuerySortBy.publishedAt,
        sortDirection: PathsPlaylistsGetParametersQuerySortDirection.desc,
      }
    case 'oldest':
      return {
        sortBy: PathsPlaylistsTracksGetParametersQuerySortBy.publishedAt,
        sortDirection: PathsPlaylistsGetParametersQuerySortDirection.asc,
      }
    case 'mostLiked':
      return {
        sortBy: PathsPlaylistsTracksGetParametersQuerySortBy.likesCount,
        sortDirection: PathsPlaylistsGetParametersQuerySortDirection.desc,
      }
    case 'leastLiked':
      return {
        sortBy: PathsPlaylistsTracksGetParametersQuerySortBy.likesCount,
        sortDirection: PathsPlaylistsGetParametersQuerySortDirection.asc,
      }
    default:
      return {
        sortBy: PathsPlaylistsTracksGetParametersQuerySortBy.publishedAt,
        sortDirection: PathsPlaylistsGetParametersQuerySortDirection.desc,
      }
  }
}
