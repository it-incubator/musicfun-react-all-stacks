import { Logout } from "../Logout/Logout.tsx"
import { useMe } from "../../api/useMe.ts"

export const MeInfo = () => {
  const query = useMe()

  return (
    <div>
      userLogin: {query.data?.data.login}
      <Logout />
    </div>
  )
}
