import { getClientConfig } from '@/shared/api/client.ts'
import type { SchemaLoginRequestPayload } from '@/shared/api/schema.ts'

export type LoginRequestPayload = SchemaLoginRequestPayload

export const getOauthRedirectUrl = (redirectUrl: string) =>
  getClientConfig().baseURL + `/auth/oauth-redirect?callbackUrl=${redirectUrl}`
