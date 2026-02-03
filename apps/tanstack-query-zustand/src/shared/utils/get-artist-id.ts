import type { components } from '@/shared/api/schema.ts'

/**
 * Gets artist ID from relationships (if available)
 */
export const getArtistId = (
  track: components['schemas']['TrackListItemOutput'] | components['schemas']['TrackDetailsData']
): string | undefined => {
  // TrackDetailsData has no relationships, TrackListItemOutput has
  if ('relationships' in track && track.relationships?.artists?.data?.[0]?.id) {
    return track.relationships.artists.data[0].id
  }

  return undefined
}
