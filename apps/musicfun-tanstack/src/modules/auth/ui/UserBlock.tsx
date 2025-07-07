import { useMeQuery } from '../api/use-me.query.ts'
import { Login } from './Login/Login.tsx'
import { MeInfo } from './MeInfo/MeInfo.tsx'

export const UserBlock = () => {
  const query = useMeQuery()

  return (
    <>
      {!query.data?.data && <Login />}
      {query.data?.data && <MeInfo />}
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
