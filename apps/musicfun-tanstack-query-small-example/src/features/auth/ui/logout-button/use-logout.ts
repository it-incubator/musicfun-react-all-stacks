import { useLogoutMutation } from '@/features/auth/api/use-logout.mutation.ts'

export const useLogout = () => {
  const { mutate } = useLogoutMutation()

  const logout = () => {
    mutate()
  }

  return { logout }
}
