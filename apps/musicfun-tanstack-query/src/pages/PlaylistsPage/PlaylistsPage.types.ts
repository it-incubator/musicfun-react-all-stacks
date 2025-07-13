import type { IPlaylistsQuery } from '@/features/playlists/api/use-playlist.query.types.ts'

export type SortOption = 'mostLiked' | 'leastLiked' | 'newest' | 'oldest'

export interface ISortConfig {
  sortBy: IPlaylistsQuery['sortBy']
  sortDirection: IPlaylistsQuery['sortDirection']
}
