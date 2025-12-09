import { useRouter } from 'expo-router'

import { useAuthContext } from '@/features/auth/model/context/AuthContext'
import { Button } from '@/shared/ui/Button/Button'

export const LogoutButton = () => {
  const { logout, isLogoutPending } = useAuthContext()
  const router = useRouter()

  const onLogout = async () => {
    await logout()
    router.replace('/(auth)/login')
  }

  return <Button disabled={isLogoutPending} title="Logout" onPress={onLogout} />
}
