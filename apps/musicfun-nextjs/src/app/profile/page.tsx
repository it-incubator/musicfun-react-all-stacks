import { authApi } from '@/shared/api/auth-api'
import { redirectAfterOauthUri } from '@/shared/api/base'
import { cookies } from 'next/headers'
import { MeResponseResponse } from '@/shared/api/authApi.types'

export default async function ProfilePage() {
  let meData: MeResponseResponse | null = null
  try {
    meData = await authApi.getMe()
  } catch (error) {}

  return meData ? (
    <div>
      login: {meData.login}, userId: {meData.userId}
    </div>
  ) : (
    <div>Login</div>
  )
}
