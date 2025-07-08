import { createFileRoute } from '@tanstack/react-router'
import { OAuthCallback } from '../../features/auth/ui/OAuthRedirect/OAuthCallback.tsx'

export const Route = createFileRoute('/oauth/callback')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <OAuthCallback />
    </div>
  )
}
