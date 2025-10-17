import { api } from '@/shared/api/client'
import type { LoginRequestPayload, RefreshOutput } from '../model/auth-api.types'

export const loginApi = async (payload: LoginRequestPayload): Promise<RefreshOutput> => {
  const res = await api().POST('/auth/login', {
    body: payload,
  })

  if (res.error) {
    throw new Error(res.error?.message)
  }

  return res.data
}
