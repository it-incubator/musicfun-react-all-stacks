import { type Images, ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import type { Track } from './types/player.types'

// Generic type for API track data
type ApiTrackBase = {
  id: string
  attributes: {
    title: string
    addedAt: string
    attachments: Array<{
      id: string
      addedAt: string
      updatedAt: string
      version: number
      url: string
      contentType: string
      originalName: string
      originalKey: string
      fileSize: number
    }>
    images: Images
    currentUserReaction: number
    dislikesCount: number
    likesCount: number
    user: { id: string; name: string }
  }
  relationships: {
    artists: {
      data: Array<{ id: string; type: string }>
    }
  }
}

/**
 * Converts API track response to Player Track format
 */
export const convertApiTrackToPlayerTrack = <T extends ApiTrackBase>(apiTrack: T): Track => {
  // Extract the audio URL from the attachments array
  // Try different possible paths for the audio URL
  const audioUrl = apiTrack.attributes.attachments?.[0]?.url || ''
  // Get medium-sized image using utility function
  const image = apiTrack.attributes.images
    ? getImageByType(apiTrack.attributes.images, ImageType.MEDIUM)
    : undefined
  const coverUrl = image?.url || ''

  // Extract artist information
  // For tracks list, artist name is in the user field
  const artistName = apiTrack.attributes.user?.name || 'Unknown Artist'

  // Extract artist ID
  const artistId = apiTrack.relationships?.artists?.data?.[0]?.id

  return {
    id: apiTrack.id,
    title: apiTrack.attributes.title,
    artist: artistName,
    duration: 0, // Not available in track list
    url: audioUrl, // This is critical - the player needs the audio URL
    albumArt: coverUrl,
    artistId: artistId,
  }
}

/**
 * Converts array of API tracks to Player Track format
 */
export const convertApiTracksToPlayerTracks = <T extends ApiTrackBase>(apiTracks: T[]): Track[] => {
  return apiTracks.map(convertApiTrackToPlayerTrack)
}
