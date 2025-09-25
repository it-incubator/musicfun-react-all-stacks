import { useLogout } from '@/features/auth/ui/logout-button/use-logout.ts'

export const LogoutButton = () => {
  const { logout: handleLogoutClick } = useLogout()

  return <button onClick={handleLogoutClick}>Logout</button>
}
