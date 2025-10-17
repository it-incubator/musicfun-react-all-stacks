import { api } from '@/shared/api/client'

export const logoutApi = async (refreshToken: string) => {
  await api().POST('/auth/logout', {
    body: { refreshToken },
  })
}
