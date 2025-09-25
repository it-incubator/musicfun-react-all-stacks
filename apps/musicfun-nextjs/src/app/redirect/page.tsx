import { authApi } from '@/shared/api/auth-api'
import { redirectAfterOauthUri } from '@/shared/api/base'
import { cookies } from 'next/headers'
import { MeResponseResponse } from '@/shared/api/authApi.types'
import { redirect } from 'next/navigation'

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
