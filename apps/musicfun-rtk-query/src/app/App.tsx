import { Loader } from '@/shared/components'

import { useIsLoading } from './hooks'
import { Routing } from './routing'

export const App = () => {
  const isLoading = useIsLoading()

  return (
    <>
      {isLoading && <Loader />}
      <Routing />
    </>
  )
}
