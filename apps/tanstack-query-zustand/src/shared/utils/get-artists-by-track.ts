import type { SchemaIncludedArtistOutput, SchemaTrackListItemResource } from '@/shared/api/schema'

export function getArtistsByTrack(
  track: SchemaTrackListItemResource,
  included: SchemaIncludedArtistOutput[]
): string {
  const artistIds = track.relationships.artists.data.map((a) => a.id)
  return included
    .filter((artist) => artistIds.includes(artist.id))
    .map((artist) => artist.attributes.name)
    .join(', ')
}
