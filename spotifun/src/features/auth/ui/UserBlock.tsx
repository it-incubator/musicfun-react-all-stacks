import { useMe } from "@/features/auth/api/hooks.ts"
import { Login } from "@/features/auth/ui/Login/Login.tsx"
import { MeInfo } from "@/features/auth/ui/MeInfo/MeInfo.tsx"

export const UserBlock = () => {
  const {
    query: { data },
  } = useMe()

  return (
    <div>
      {!data && <Login />}
      {data && <MeInfo />}
    </div>
  )
}
