// Response
export type OAuthResponse = {
  refreshToken: string
  accessToken: string
}

// Arguments
export type LoginArgs = {
  code: string
  redirectUri: string
  accessTokenTTL: string // e.g. "3m"
  rememberMe: boolean
}
