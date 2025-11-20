import { api } from '@/shared/api/client'
import type { User } from '../model/user.types'

export const meApi = async (): Promise<User> => {
  const res = await api().GET('/auth/me')
  return res.data ?? null
}
