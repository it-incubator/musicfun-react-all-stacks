import { useLogin } from '@/features/auth/ui/login-button/use-login.tsx'

export const LoginButton = () => {
  const { login: handleLoginClick } = useLogin()

  return <button onClick={handleLoginClick}>Login with APIHUB</button>
}
