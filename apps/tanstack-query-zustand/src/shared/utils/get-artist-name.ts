import type { components } from '@/shared/api/schema.ts'

/**
 * Gets artist name from different sources
 */
export const getArtistName = (
  attributes:
    | components['schemas']['TrackListItemAttributes']
    | components['schemas']['TrackDetailsAttributes'],
  user?: components['schemas']['UserRef']
): string => {
  // TrackDetailsAttributes has artists array
  if ('artists' in attributes && attributes.artists && attributes.artists.length > 0) {
    return attributes.artists.map((a) => a.name).join(', ')
  }

  // Otherwise use user name
  return user?.name || 'Unknown Artist'
}
