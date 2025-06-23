import { Logout } from "../Logout/Logout.tsx"
import { useGetMeQuery } from "@/features/auth/api/auth-api.ts"

export const MeInfo = () => {
  const {data} = useGetMeQuery()

  return (
    <div>
      userLogin: {data?.login}
      <Logout />
    </div>
  )
}
