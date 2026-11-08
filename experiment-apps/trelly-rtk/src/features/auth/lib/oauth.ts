import { OAUTH_ACCESS_TOKEN_TTL } from "@/common/constants"
import { Path } from "@/common/routing"

import type { OAuthLoginArgs } from "../api/authApi.types.ts"

export const OAUTH_MESSAGE_TYPE = "trelly-oauth-code"

export const getOAuthRedirectUri = () => window.location.origin + Path.OAuthRedirect

// GET /auth/oauth-redirect — the backend redirects to API Hub, which then redirects back with ?code=
export const getOAuthStartUrl = () =>
  `${import.meta.env.VITE_BASE_URL}/auth/oauth-redirect?callbackUrl=${encodeURIComponent(getOAuthRedirectUri())}`

export const buildOAuthLoginArgs = (code: string, rememberMe: boolean): OAuthLoginArgs => ({
  code,
  redirectUri: getOAuthRedirectUri(),
  accessTokenTTL: OAUTH_ACCESS_TOKEN_TTL,
  rememberMe,
})

// Used when the popup is blocked and the whole page goes through the OAuth flow
const REMEMBER_ME_KEY = "trelly-oauth-remember-me"
export const oauthSession = {
  save: (rememberMe: boolean) => sessionStorage.setItem(REMEMBER_ME_KEY, String(rememberMe)),
  pop: () => {
    const value = sessionStorage.getItem(REMEMBER_ME_KEY) !== "false"
    sessionStorage.removeItem(REMEMBER_ME_KEY)
    return value
  },
}
