import type { SchemaGetPlaylistsRequestPayload } from '@/shared/api/schema.ts'

export type SortOption = 'mostLiked' | 'leastLiked' | 'newest' | 'oldest'

export interface ISortConfig {
  sortBy: SchemaGetPlaylistsRequestPayload['sortBy']
  sortDirection: SchemaGetPlaylistsRequestPayload['sortDirection']
}
