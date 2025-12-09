import '../src/styles/fonts.css'
import '../src/styles/variables.css'
import '../src/styles/reset.css'
import '../src/styles/global.css'

import type { Preview } from '@storybook/react-vite'
import React from 'react'
import { BrowserRouter } from 'react-router'

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
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
}

export default preview
