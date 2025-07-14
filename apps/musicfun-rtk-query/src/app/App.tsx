import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'

import { Routing } from './routing'
import { store } from './store'

export const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Routing />
      </Provider>
    </BrowserRouter>
  )
}
