import { useMeQuery } from '../api/use-me.query.ts'
import { Login } from '@/features/auth/ui/login/login.component.tsx'
import { MeInfoComponent } from '@/features/auth/ui/me-info/me-info.component.tsx'

export const UserBlock = () => {
  const query = useMeQuery()

  return (
    <div>
      {!query.data && <Login />}
      {query.data && <MeInfoComponent />}
    </div>
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
