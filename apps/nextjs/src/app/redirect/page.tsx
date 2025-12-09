import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { authApi } from '@/shared/api/auth-api'
import { MeResponseResponse } from '@/shared/api/authApi.types'
import { redirectAfterOauthUri } from '@/shared/api/base'

export default async function ProfilePage() {
  let meData: MeResponseResponse | null = null
  try {
    meData = await authApi.getMe()
  } catch (error) {}

  if (meData) {
    redirect('/profile')
  } else {
    redirect('/')
  }
}
