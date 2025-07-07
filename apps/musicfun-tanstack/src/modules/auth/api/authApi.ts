import { authEndpoint } from '@/common/apiEntities'
import { getInstance } from '@/common/instance'
import type { RefreshOutput, RefreshRequestPayload } from './authApi.types.ts'

export const authApi = {
  oauthUrl: (redirectUrl: string): string => {
    return getInstance().getUri() + `/auth/oauth-redirect?callbackUrl=${redirectUrl}`
  },
  refreshToken: (payload: RefreshRequestPayload) => {
    return getInstance().post<RefreshOutput>(`${authEndpoint}/refresh`, payload)
  },
}
