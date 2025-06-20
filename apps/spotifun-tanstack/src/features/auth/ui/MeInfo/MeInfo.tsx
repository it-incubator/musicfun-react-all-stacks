import { Path } from "@/common/routing"
import { Logout } from "../Logout/Logout.tsx"
import { useMe } from "../../api/useMe.ts"
import { NavLink } from "react-router"

export const MeInfo = () => {
  const { data } = useMe()

  return (
    <>
      <NavLink to={Path.Profile}>{data?.data.login}</NavLink>
      <Logout />
    </>
  )
}
