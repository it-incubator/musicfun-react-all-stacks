import { createRootRoute } from '@tanstack/react-router'
import { RootLayout } from '../layouts/root-layout.tsx'

export const Route = createRootRoute({
  component: RootLayout,
})
