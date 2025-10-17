import { getClientConfig } from '@/shared/api/client.ts'
import type { components } from '@/shared/api/schema.ts'

export type RefreshOutput = components['schemas']['RefreshOutput']
export type RefreshRequestPayload = components['schemas']['RefreshRequestPayload']
export type LoginRequestPayload = components['schemas']['LoginRequestPayload']

export const localStorageKeys = {
  refreshToken: 'spotifun-refresh-token',
  accessToken: 'spotifun-access-token',
}

export const getOauthRedirectUrl = (redirectUrl: string) =>
  getClientConfig().baseURL + `/auth/oauth-redirect?callbackUrl=${redirectUrl}`
