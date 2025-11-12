import '../shared/translations/i18nConfiguration'

import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'

import { Routing } from './routing'
import { store } from './store'

export const App = () => {
  return (
    <BrowserRouter basename="/rtkquery">
      <Provider store={store}>
        <Routing />
      </Provider>
    </BrowserRouter>
  )
}
