// Create a new router instance
import { createRouter } from '@tanstack/react-router'
import { routeTree } from '../routes/routeTree.gen.ts'

export const routerInstance = createRouter({ routeTree })
// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof routerInstance
  }
}
