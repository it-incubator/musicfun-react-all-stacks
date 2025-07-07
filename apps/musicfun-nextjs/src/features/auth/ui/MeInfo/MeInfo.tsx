import { authApi } from '@/shared/api/auth-api'
import { Logout } from '@/features/auth/ui/Logout/Logout'

export const MeInfo = async () => {
  let meData = await authApi.getMe()

  return (
    <div>
      userLogin: {meData.login}
      <Logout />
    </div>
  )
}
