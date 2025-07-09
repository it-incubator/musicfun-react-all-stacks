import type { components } from '../../../shared/api/schema.ts'
import { getClientConfig } from '../../../shared/api/client.ts'

export type RefreshOutput = components['schemas']['RefreshOutput']

export type RefreshRequestPayload = components['schemas']['RefreshRequestPayload']

export type LoginRequestPayload = components['schemas']['LoginRequestPayload']

export const getOauthRedirectUrl = (redirectUrl: string) =>
  getClientConfig().baseURL + `/auth/oauth-redirect?callbackUrl=${redirectUrl}`
