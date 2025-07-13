import { createRootRoute } from '@tanstack/react-router'
import 'react-toastify/dist/ReactToastify.css'
import { RootLayout } from '@/app/layouts/root-layout.tsx'

export const Route = createRootRoute({
  component: RootLayout,
})
