import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'

import { fork } from 'effector'
import { Provider } from 'effector-react'

declare global {
  interface Window {
    INITIAL_STATE?: Record<string, unknown>
  }
}

startTransition(() => {
  const initialState = window.INITIAL_STATE

  const scope = fork({
    values: initialState,
  })

  hydrateRoot(
    document,
    <StrictMode>
      <Provider value={scope}>
        <HydratedRouter />
      </Provider>
    </StrictMode>,
  )
})
