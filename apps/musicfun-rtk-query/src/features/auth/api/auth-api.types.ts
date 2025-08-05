export type GetMeResponse = {
  userId: string
  login: string
}

export type AuthTokensResponse = {
  refreshToken: string
  accessToken: string
}

export type OAuthLoginArgs = {
  code: string
  redirectUri: string
  accessTokenTTL: string // e.g. "3m"
  rememberMe: boolean
}
