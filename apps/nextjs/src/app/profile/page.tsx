import { cookies } from 'next/headers'

import { authApi } from '@/shared/api/auth-api'
import { MeResponseResponse } from '@/shared/api/authApi.types'
import { redirectAfterOauthUri } from '@/shared/api/base'

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
