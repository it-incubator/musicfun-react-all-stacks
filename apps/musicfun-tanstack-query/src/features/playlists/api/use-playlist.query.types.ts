export interface IPlaylistsQuery {
  search?: string
  pageNumber: number
  pageSize?: number
  userId?: string
  sortBy?: 'addedAt' | 'likesCount'
  sortDirection?: 'asc' | 'desc'
  tagsIds?: string[]
  trackId?: string
}
