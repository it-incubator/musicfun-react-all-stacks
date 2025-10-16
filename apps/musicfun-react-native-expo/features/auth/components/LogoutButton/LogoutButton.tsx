import { Button } from '@/shared/ui/Button/Button'
import { useAuthContext } from '@/features/auth/model/context/AuthContext'
import { useRouter } from 'expo-router'

export const LogoutButton = () => {
  const { logout, isLogoutPending } = useAuthContext()
  const router = useRouter()

  const onLogout = async () => {
    await logout()
    router.replace('/(auth)/login')
  }

  return <Button disabled={isLogoutPending} title="Logout" onPress={onLogout} />
}
