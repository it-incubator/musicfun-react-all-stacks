import { Login } from '@/features/auth/ui/Login/Login'
import { MeInfo } from '@/features/auth/ui/MeInfo/MeInfo'
import { authApi } from '@/shared/api/auth-api'
import { MeResponseResponse } from '@/shared/api/authApi.types'

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
