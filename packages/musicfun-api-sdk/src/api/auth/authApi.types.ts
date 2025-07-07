export type MeResponseResponse = {
  userId: string
  login: string
}

export type AuthTokensResponse = {
  refreshToken: string
  accessToken: string
}

export type RefreshTokensRequest = {
  refreshToken: string
}

export const localStorageKeys = {
  refreshToken: 'musicfun-refresh-token',
  accessToken: 'musicfun-access-token',
}
