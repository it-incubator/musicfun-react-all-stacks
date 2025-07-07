import { AuthTokensResponse, MeResponseResponse, RefreshTokensRequest } from './authApi.types'
import { authEndpoint } from '../../common/apiEntities/apiEntities'
import { getApiClient } from '../../v2/request'
import { joinUrl } from '../../common/utils/urlHelper'

export const authApi = {
  login: (payload: OAuthLoginRequest) => {
    return getApiClient().post<AuthTokensResponse>(`${authEndpoint}/login`, payload)
  },
  logout: (payload: RefreshTokensRequest) => {
    return getApiClient().post(`${authEndpoint}/logout`, payload)
  },
  oauthUrl: (redirectUrl: string): string => {
    const url = joinUrl(
      getApiClient().getConfig().baseURL,
      `/auth/oauth-redirect?callbackUrl=${encodeURIComponent(redirectUrl)}`,
    )
    return url
  },
  refreshToken: (payload: RefreshTokensRequest) => {
    return getApiClient().post<AuthTokensResponse>(`${authEndpoint}/refresh`, payload)
  },
  getMe: () => {
    return getApiClient().get<MeResponseResponse>(`${authEndpoint}/me`)
  },
}

export type OAuthLoginRequest = {
  code: string
  redirectUri: string
  accessTokenTTL: string // e.g. "3m"
  rememberMe: boolean
}
