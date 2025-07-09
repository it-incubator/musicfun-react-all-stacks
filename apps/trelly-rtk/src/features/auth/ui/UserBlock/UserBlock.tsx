import { useNavigate } from "react-router"
import { NavButton } from "@/common/components"
import { Path } from "@/common/routing"
import { useLogoutMutation, useMeQuery } from "@/features/auth/api/authApi"

export const UserBlock = () => {
  const navigate = useNavigate()

  const { data: user } = useMeQuery()

  const [logout] = useLogoutMutation()

  const handleLogout = () => logout()

  const handleLogin = () => navigate(Path.Login)

  if (!user) {
    return (
      <div>
        <NavButton onClick={handleLogin}>Login</NavButton>
      </div>
    )
  }

  return (
    <div>
      <span>name: {user.login}</span>
      <NavButton onClick={handleLogout}>Sign out</NavButton>
    </div>
  )
}
