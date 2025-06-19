import { authEndpoint } from "@/common/apiEntities"
import { getInstance } from "@/common/instance"
import type { AuthTokensResponse, MeResponseResponse, OAuthLoginArgs, RefreshTokensArgs } from "./authApi.types.ts"

export const authApi = {
  login: (payload: OAuthLoginArgs) => {
    return getInstance().post<AuthTokensResponse>(`${authEndpoint}/login`, payload)
  },
  logout: (payload: RefreshTokensArgs) => {
    return getInstance().post(`${authEndpoint}/logout`, payload)
  },
  oauthUrl: (redirectUrl: string): string => {
    return getInstance().getUri() + `/auth/oauth-redirect?callbackUrl=${encodeURIComponent(redirectUrl)}`
  },
  refreshToken: (payload: RefreshTokensArgs) => {
    return getInstance().post<AuthTokensResponse>(`${authEndpoint}/refresh`, payload)
  },
  getMe: () => {
    return getInstance().get<MeResponseResponse>(`${authEndpoint}/me`)
  },
}
