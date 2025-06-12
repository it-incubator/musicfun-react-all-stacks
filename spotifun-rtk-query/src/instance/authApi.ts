import { instance } from "./instance.ts"
import type { AuthTokensResponse, MeResponseResponse, RefreshTokensRequest } from "./authApi.types.ts"

export const ApiEntities = {
  tracks: {
    queryKey: "tracks",
    endpoint: "tracks",
  },
  playlists: {
    queryKey: "playlists",
    endpoint: "playlists",
  },
  tags: {
    queryKey: "tags",
    endpoint: "tags",
  },
  artists: {
    queryKey: "artists",
    endpoint: "artists",
  },
  authentication: {
    queryKey: "auth",
    endpoint: "auth",
  },
} as const


export const tracksEndpoint = ApiEntities.tracks.endpoint

export const authEndpoint = ApiEntities.authentication.endpoint

export const authApi = {
  login: (payload: OAuthLoginRequest) => {
    return instance.post<AuthTokensResponse>(`${authEndpoint}/login`, payload)
  },
  logout: (payload: RefreshTokensRequest) => {
    return instance.post(`${authEndpoint}/logout`, payload)
  },
  oauthUrl: (redirectUrl: string): string => {
    const url = instance.getUri() + `/auth/oauth-redirect?callbackUrl=${encodeURIComponent(redirectUrl)}`
    return url
  },
  refreshToken: (payload: RefreshTokensRequest) => {
    return instance.post<AuthTokensResponse>(`${authEndpoint}/refresh`, payload)
  },
  getMe: () => {
    return instance.get<MeResponseResponse>(`${authEndpoint}/me`)
  },
}

export type OAuthLoginRequest = {
  code: string
  redirectUri: string
  accessTokenTTL: string // e.g. "3m"
  rememberMe: boolean
}
