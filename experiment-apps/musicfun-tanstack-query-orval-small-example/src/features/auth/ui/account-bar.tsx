import { CurrentUser } from '@/features/auth/ui/current-user/current-user.tsx'
import { LoginButton } from '@/features/auth/ui/login-button/login-button.tsx'

import { useMeQuery } from '../api/use-me.query.ts'

export const AccountBar = () => {
  const query = useMeQuery()

  return (
    <div>
      {!query.data && <LoginButton />}
      {query.data && <CurrentUser />}
    </div>
  )
}
