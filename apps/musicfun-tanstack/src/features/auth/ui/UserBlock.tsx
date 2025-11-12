import { useMe } from '../api/useMe.ts'
import { Login } from './Login/Login.tsx'
import { MeInfo } from './MeInfo/MeInfo.tsx'

export const UserBlock = () => {
  const query = useMe()

  return (
    <>
      {!query.data && <Login />}
      {query.data && <MeInfo />}
    </>
  )
}

// version for   qc.invalidateQueries({ queryKey: [authKey] }) in useLogout
// export const UserBlock = () => {
//   const { data, isLoading, isError } = useMe()
//
//   if (isLoading) return <div>Loading…</div>
//   if (isError) return <Login />
//   if (data) return <MeInfo />
//
//   return null
// }
