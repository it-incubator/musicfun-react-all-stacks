import { createFileRoute } from '@tanstack/react-router'
import { OAuthCallbackPage } from '@/pages/oauth-callback'

export const Route = createFileRoute('/oauth/callback')({
  component: OAuthCallbackPage,
})
