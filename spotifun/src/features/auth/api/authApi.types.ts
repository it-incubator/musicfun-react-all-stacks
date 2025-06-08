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
  refreshToken: "spotifun-refresh-token",
  accessToken: "spotifun-access-token",
}
