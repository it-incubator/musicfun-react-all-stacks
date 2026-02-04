import type { components } from '@/shared/api/schema.ts'

/**
 * Gets artist name from different sources
 */
export const getArtistName = (
  attributes:
    | components['schemas']['TrackListItemOutputAttributes']
    | components['schemas']['TrackDetailsAttributes'],
  user?: components['schemas']['UserOutputDTO']
): string => {
  // TrackDetailsAttributes has artist field
  if ('artist' in attributes && attributes.artist && typeof attributes.artist === 'string') {
    return attributes.artist
  }

  // Otherwise use user name
  return user?.name || 'Unknown Artist'
}
