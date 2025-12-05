export type ResMeT = {
  userId: string
  login: string
}

export type RequestLoginT = {
  code: string
  redirectUri: string
  accessTokenTTL: string
  rememberMe: boolean
}

export type RequestLogoutT = {
  refreshToken: string
  rememberMe: boolean
  accessTokenTTL: string
  redirectUri: string
}

export type ResponseLoginT = {
  accessToken: string
  refreshToken: string
}
