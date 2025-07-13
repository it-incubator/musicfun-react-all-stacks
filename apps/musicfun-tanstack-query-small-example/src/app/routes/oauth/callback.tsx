import { createFileRoute } from '@tanstack/react-router'
import { OauthCallbackPage } from '@/pages/auth'

export const Route = createFileRoute('/oauth/callback')({
  component: OauthCallbackPage,
})
