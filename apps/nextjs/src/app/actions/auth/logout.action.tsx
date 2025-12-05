'use server'
import { cookies } from 'next/headers'

export async function logout() {
  const cookieStore = await cookies()
  // удаляем куки, задав maxAge: 0
  cookieStore.set('access-token', '', { httpOnly: true, maxAge: 0, path: '/' })
  cookieStore.set('refresh-token', '', { httpOnly: true, maxAge: 0, path: '/' })
}
