import { Logout } from "../Logout/Logout.tsx"
import { useGetMeQuery } from "@/features/auth/api/auth-api.ts"
import { NavLink } from "react-router"
import { Path } from "@/common/routing"

export const MeInfo = () => {
  const { data } = useGetMeQuery()

  return (
    <div>
      userLogin:
      <NavLink to={Path.Profile}>{data?.login} </NavLink>
      <Logout />
    </div>
  )
}
