import { Login } from "./Login/Login.tsx"
import { MeInfo } from "./MeInfo/MeInfo.tsx"
import { useGetMeQuery } from "@/features/auth/api/auth-api.ts"

export const UserBlock = () => {
  const query = useGetMeQuery()

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
