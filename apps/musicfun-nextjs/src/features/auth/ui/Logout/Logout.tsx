'use client'
import { useRouter } from 'next/navigation'
import { logout } from '@/app/actions/auth/logout.action'

export const Logout = () => {
  const router = useRouter()
  const logoutHandler = async () => {
    await logout()
    router.push('/')
  }

  return <button onClick={logoutHandler}>logout</button>
}
