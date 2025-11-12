import { Login } from './Login/Login.tsx'
import { MeInfo } from './MeInfo/MeInfo.tsx'
import { useGetMeQuery } from '@/features/auth/api/auth-api.ts'

export const UserBlock = () => {
  const query = useGetMeQuery()

  return (
    <>
      {!query.data && <Login />}
      {query.data && <MeInfo />}
    </>
  )
}
