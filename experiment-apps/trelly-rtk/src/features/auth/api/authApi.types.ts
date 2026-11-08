// Response
export type TokensResponse = {
  refreshToken: string
  accessToken: string
}

export type MeResponse = {
  userId: string
  login: string
}

// Arguments
export type OAuthLoginArgs = {
  code: string
  redirectUri: string
  accessTokenTTL?: string // e.g. "3m"
  rememberMe: boolean
}

export type SimpleLoginArgs = {
  login: string
  password: string
  rememberMe: boolean
}
