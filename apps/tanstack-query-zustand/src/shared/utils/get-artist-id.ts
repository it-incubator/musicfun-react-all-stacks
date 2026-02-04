import type { components } from '@/shared/api/schema.ts'

/**
 * Gets artist ID from relationships (if available)
 */
export const getArtistId = (
  track:
    | components['schemas']['TrackListItemResource']
    | components['schemas']['TrackDetailsResource']
): string | undefined => {
  // TrackListItemResource has relationships
  if ('relationships' in track && track.relationships?.artists?.data?.[0]?.id) {
    return track.relationships.artists.data[0].id
  }

  // TrackDetailsResource has artists in attributes
  if ('attributes' in track && 'artists' in track.attributes && track.attributes.artists?.[0]?.id) {
    return track.attributes.artists[0].id
  }

  return undefined
}
