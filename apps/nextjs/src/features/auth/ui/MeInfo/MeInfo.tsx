import { Logout } from '@/features/auth/ui/Logout/Logout'
import { authApi } from '@/shared/api/auth-api'

export const MeInfo = async () => {
  const meData = await authApi.getMe()

  return (
    <div>
      userLogin: {meData.login}
      <Logout />
    </div>
  )
}
