import { useMe } from "../api/useMe.ts"
import { Login } from "./Login/Login.tsx"
import { MeInfo } from "./MeInfo/MeInfo.tsx"

export const UserBlock = () => {
  const { data } = useMe()

  return (
    <div>
      {!data && <Login />}
      {data && <MeInfo />}
    </div>
  )
}
