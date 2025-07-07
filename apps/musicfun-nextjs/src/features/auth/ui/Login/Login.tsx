import { authApi } from '@/shared/api/auth-api'
import { redirectAfterOauthUri } from '@/shared/api/base'

export const Login = () => {
  return <a href={authApi.oauthUrl(redirectAfterOauthUri)}>Login via APIHUB</a>
}
