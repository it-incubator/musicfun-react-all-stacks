import { type BaseAttributes, type TrackDetails } from '@/features/tracks/api/tracksApi.types.ts'
import { ImageType } from '@/shared/types/commonApi.types.ts'
import { getImageByType } from '@/shared/utils'

import type { Track } from '../types/player.types.ts'

type AnyTrack = TrackDetails<BaseAttributes & { user?: { id: string; name: string } }>

/**
 * Converts API track response to Player Track format
 */
export const convertApiTrackToPlayerTrack = <T extends AnyTrack>(apiTrack: T): Track => {
  const audioUrl = apiTrack.attributes.attachments?.[0]?.url || ''
  const image = apiTrack.attributes.images
    ? getImageByType(apiTrack.attributes.images, ImageType.MEDIUM)
    : undefined
  const coverUrl = image?.url || ''

  const artistName = apiTrack.attributes.user?.name || 'Unknown Artist'
  const artistId = apiTrack.relationships?.artists?.data?.[0]?.id

  return {
    id: apiTrack.id,
    title: apiTrack.attributes.title,
    artist: artistName,
    duration: 0,
    url: audioUrl,
    albumArt: coverUrl,
    artistId: artistId,
  }
}

/**
 * Converts array of API tracks to Player Track format
 */
export const convertApiTracksToPlayerTracks = <T extends AnyTrack>(apiTracks: T[]): Track[] => {
  return apiTracks.map(convertApiTrackToPlayerTrack)
}
