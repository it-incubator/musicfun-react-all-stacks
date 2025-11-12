import '../src/styles/fonts.css'
import '../src/styles/variables.css'
import '../src/styles/reset.css'
import '../src/styles/global.css'

import { configureStore } from '@reduxjs/toolkit'
import type { Preview } from '@storybook/react-vite'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'

const mockStore = configureStore({
  reducer: {},
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </Provider>
    ),
  ],
}

export default preview
