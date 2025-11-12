import { API_BASE_URL } from '../../env'

export const getOauthRedirectUrl = (redirectUrl: string) =>
  `${API_BASE_URL}/auth/oauth-redirect?callbackUrl=${encodeURIComponent(redirectUrl)}`
