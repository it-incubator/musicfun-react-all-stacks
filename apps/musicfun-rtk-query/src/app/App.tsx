import { Provider } from 'react-redux'

import { Routing } from './routing'
import { store } from './store'

export const App = () => {
  return (
    <Provider store={store}>
      <Routing />
    </Provider>
  )
}
