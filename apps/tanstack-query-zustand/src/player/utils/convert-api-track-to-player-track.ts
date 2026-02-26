import type { ApiTrack } from '@/shared/types/api-track.types.ts'
import type { Track } from '../types/player.types'
import { getCoverUrl } from '@/shared/utils/get-cover-url'
import { getAudioUrl } from '@/shared/utils/get-audio-url'
import { getArtistName } from '@/shared/utils/get-artist-name'
import { getArtistId } from '@/shared/utils/get-artist-id'

/**
 * Converts API track response to Player Track format
 */
export const convertApiTrackToPlayerTrack = (apiTrack: any): Track => {
  // Extract attributes based on type
  const attributes = apiTrack.attributes

  // Get user (if available)
  const user = 'user' in attributes ? attributes.user : undefined

  // Extract audio URL
  const audioUrl = getAudioUrl(attributes.attachments)

  // Get cover URL
  const coverUrl = getCoverUrl(attributes.images)

  // Get artist name
  const artistName = getArtistName(attributes, user)

  // Get artist ID
  const artistId = getArtistId(apiTrack)

  // Get duration (available in TrackDetailsAttributes, not in TrackListItemOutput)
  const duration = 'duration' in attributes ? attributes.duration : 0

  return {
    id: apiTrack.id,
    title: attributes.title,
    artist: artistName,
    duration, // 0 for track lists, actual value for detailed info
    url: audioUrl, // Critical - player needs audio URL
    albumArt: coverUrl,
    artistId: artistId,
    album: undefined, // Not available in current schema
  }
}

/**
 * Converts array of API tracks to Player Track format
 */
export const convertApiTracksToPlayerTracks = (apiTracks: any[]): Track[] => {
  return apiTracks.map(convertApiTrackToPlayerTrack)
}
