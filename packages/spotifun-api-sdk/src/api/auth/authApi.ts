import { getInstance } from "../../common/instance/instance"
import { AuthTokensResponse, MeResponseResponse, RefreshTokensRequest } from "./authApi.types"
import { authEndpoint } from "../../common/apiEntities/apiEntities"


export const authApi = {
  login: (payload: OAuthLoginRequest) => {
    return getInstance().post<AuthTokensResponse>(`${authEndpoint}/login`, payload)
  },
  logout: (payload: RefreshTokensRequest) => {
    return getInstance().post(`${authEndpoint}/logout`, payload)
  },
  oauthUrl: (redirectUrl: string): string => {
    const url = getInstance().getUri() + `/auth/oauth-redirect?callbackUrl=${encodeURIComponent(redirectUrl)}`
    return url
  },
  refreshToken: (payload: RefreshTokensRequest) => {
    return getInstance().post<AuthTokensResponse>(`${authEndpoint}/refresh`, payload)
  },
  getMe: () => {
    return getInstance().get<MeResponseResponse>(`${authEndpoint}/me`)
  },
}

export type OAuthLoginRequest = {
  code: string
  redirectUri: string
  accessTokenTTL: string // e.g. "3m"
  rememberMe: boolean
}
