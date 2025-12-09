import 'react-toastify/dist/ReactToastify.css'

import { createRootRoute } from '@tanstack/react-router'

import { RootLayout } from '@/app/layouts/root-layout.tsx'

export const Route = createRootRoute({
  component: RootLayout,
})
