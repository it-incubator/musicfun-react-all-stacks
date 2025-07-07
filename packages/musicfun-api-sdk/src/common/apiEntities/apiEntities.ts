export const ApiEntities = {
  tracks: {
    queryKey: 'tracks',
    endpoint: 'tracks',
  },
  playlists: {
    queryKey: 'playlists',
    endpoint: 'playlists',
  },
  tags: {
    queryKey: 'tags',
    endpoint: 'tags',
  },
  artists: {
    queryKey: 'artists',
    endpoint: 'artists',
  },
  authentication: {
    queryKey: 'auth',
    endpoint: 'auth',
  },
} as const

export const tracksEndpoint = ApiEntities.tracks.endpoint
export const tracksKey = ApiEntities.tracks.queryKey

export const playlistsEndpoint = ApiEntities.playlists.endpoint
export const playlistsKey = ApiEntities.playlists.queryKey

export const tagsEndpoint = ApiEntities.tags.endpoint
export const tagsKey = ApiEntities.tags.queryKey

export const artistsEndpoint = ApiEntities.artists.endpoint
export const artistsKey = ApiEntities.artists.queryKey

export const authEndpoint = ApiEntities.authentication.endpoint
export const authKey = ApiEntities.authentication.queryKey
