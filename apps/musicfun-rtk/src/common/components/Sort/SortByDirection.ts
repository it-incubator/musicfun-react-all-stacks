import type { Playlist } from '@/features/playlists/api/playlistsApi.types.ts'

export type SortDirection = 'new' | 'old' | 'topRate'

export const sortByDirection = (items: Playlist[], sortDirection: SortDirection): Playlist[] => {
  const sortedItems = items.slice()
  switch (sortDirection) {
    case 'old':
      sortedItems.sort((a, b) => (a.attributes.addedAt > b.attributes.addedAt ? 1 : -1))
      break
    case 'topRate':
      sortedItems.sort((a, b) => b.attributes.likesCount - a.attributes.likesCount)
      break
    default:
      sortedItems.sort((a, b) => (b.attributes.addedAt > a.attributes.addedAt ? 1 : -1))
      break
  }
  return sortedItems
}
