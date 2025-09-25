import '../src/app/styles/fonts.css'
import '../src/app/styles/variables.css'
import '../src/app/styles/reset.css'
import '../src/app/styles/global.css'

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
