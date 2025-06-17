import { useMe } from "../api/useMe.ts"
import { Login } from "./Login/Login.tsx"
import { MeInfo } from "./MeInfo/MeInfo.tsx"

export const UserBlock = () => {
  const {
    query: { data },
  } = useMe()

  return (
    <>
      {!data && <Login />}
      {data && <MeInfo />}
    </>
  )
}
