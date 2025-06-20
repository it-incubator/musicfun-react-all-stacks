import { Logout } from "../Logout/Logout.tsx"
import { useMe } from "../../api/useMe.ts"

export const MeInfo = () => {
  const {
    query: { data },
  } = useMe()

  return (
    <div>
      userLogin: {data?.data.login}
      <Logout />
    </div>
  )
}
