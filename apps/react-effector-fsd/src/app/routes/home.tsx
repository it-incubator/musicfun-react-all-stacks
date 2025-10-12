import type { Route } from '@router/routes/+types/home' // эквивалентно './+types/home'
import { Home as HomePage } from '@/pages/home'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Musicfun Home' }, { name: 'description', content: 'Welcome to musicfun home!' }]
}

export default function Home() {
  return <HomePage />
}
