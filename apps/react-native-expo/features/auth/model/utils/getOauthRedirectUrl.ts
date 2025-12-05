import { API_ROOT } from '@/shared/api/api-root/api-root'

export const getOauthRedirectUrl = (redirectUrl: string) =>
  `${API_ROOT}/auth/oauth-redirect?callbackUrl=${encodeURIComponent(redirectUrl)}`
