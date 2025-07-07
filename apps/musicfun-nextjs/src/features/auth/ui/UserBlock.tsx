import { MeResponseResponse } from '@/shared/api/authApi.types'
import { authApi } from '@/shared/api/auth-api'
import { MeInfo } from '@/features/auth/ui/MeInfo/MeInfo'
import { Login } from '@/features/auth/ui/Login/Login'

export const UserBlock = async () => {
  let meData: MeResponseResponse | null = null
  try {
    meData = await authApi.getMe()
  } catch (error) {}

  return (
    <>
      {!meData && <Login />}
      {meData && <MeInfo />}
    </>
  )
}
