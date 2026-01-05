import type { Track } from './types/player.types'

/**
 * Converts API track response to Player Track format
 */
export const convertApiTrackToPlayerTrack = (apiTrack: any): Track => {
  // Extract the audio URL from the attachments array
  // Try different possible paths for the audio URL
  const audioUrl = apiTrack.attributes.attachments?.[0]?.url || ''
  const coverUrl = apiTrack.attributes.images?.main?.[0]?.url || ''

  // Extract artist information
  // For tracks list, artist name is typically in the user field
  // For detailed track view, it might be in attributes.artists
  const artistName =
    apiTrack.attributes.artists?.[0]?.name || apiTrack.attributes.user?.name || 'Unknown Artist'

  // Extract artist ID
  const artistId =
    apiTrack.attributes.artists?.[0]?.id || apiTrack.relationships?.artists?.data?.[0]?.id

  return {
    id: apiTrack.id,
    title: apiTrack.attributes.title,
    artist: artistName,
    album: apiTrack.attributes.album?.name || undefined,
    duration: apiTrack.attributes.duration || 0,
    url: audioUrl, // This is critical - the player needs the audio URL
    albumArt: coverUrl,
    artistId: artistId,
    albumId: apiTrack.attributes.album?.id,
  }
}

/**
 * Converts array of API tracks to Player Track format
 */
export const convertApiTracksToPlayerTracks = (apiTracks: any[]): Track[] => {
  return apiTracks.map(convertApiTrackToPlayerTrack)
}
