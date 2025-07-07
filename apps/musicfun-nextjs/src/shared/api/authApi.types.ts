export type MeResponseResponse = {
  userId: string
  login: string
}

export type AuthTokensResponse = {
  refreshToken: string
  accessToken: string
}

export type RefreshTokensArgs = {
  refreshToken: string
}

export type OAuthLoginArgs = {
  code: string
  redirectUri: string
  accessTokenTTL: string // e.g. "3m"
  rememberMe: boolean
}

export const localStorageKeys = {
  refreshToken: 'musicfun-refresh-token',
  accessToken: 'musicfun-access-token',
}
