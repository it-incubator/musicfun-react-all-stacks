import { authEndpoint } from "@/common/apiEntities"
import { instance } from "@/common/instance"
import {
  type AuthTokensResponse,
  type MeResponseResponse,
  type RefreshTokensRequest,
} from "@/features/auth/api/authApi.types.ts"

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
