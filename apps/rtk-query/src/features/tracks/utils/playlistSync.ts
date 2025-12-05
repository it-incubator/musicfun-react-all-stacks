type PlaylistSyncParams = {
  originalPlaylistIds: string[]
  newPlaylistIds: string[]
  trackId: string
  addTrackToPlaylist: (params: { trackId: string; playlistId: string }) => Promise<unknown>
  removeTrackFromPlaylist: (params: { trackId: string; playlistId: string }) => Promise<unknown>
}

/**
 * Sync track playlists
 * - Add track to new playlists
 * - Remove track from playlists where it is no longer present
 */
export const syncTrackPlaylists = async ({
  originalPlaylistIds,
  newPlaylistIds,
  trackId,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
}: PlaylistSyncParams): Promise<void> => {
  const promises: Promise<unknown>[] = []

  // Add track to new playlists
  const playlistsToAdd = newPlaylistIds.filter(
    (playlistId) => !originalPlaylistIds.includes(playlistId)
  )
  for (const playlistId of playlistsToAdd) {
    promises.push(addTrackToPlaylist({ trackId, playlistId }))
  }

  // Remove track from playlists where it is no longer present
  const playlistsToRemove = originalPlaylistIds.filter(
    (playlistId) => !newPlaylistIds.includes(playlistId)
  )
  for (const playlistId of playlistsToRemove) {
    promises.push(removeTrackFromPlaylist({ trackId, playlistId }))
  }

  await Promise.all(promises)
}

/**
 * Add track to all specified playlists
 */
export const addTrackToPlaylists = async (
  trackId: string,
  playlistIds: string[],
  addTrackToPlaylist: (params: { trackId: string; playlistId: string }) => Promise<unknown>
): Promise<void> => {
  const promises = playlistIds.map((playlistId) => addTrackToPlaylist({ trackId, playlistId }))
  await Promise.all(promises)
}
