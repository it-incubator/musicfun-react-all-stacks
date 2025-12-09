import type { Meta, StoryObj } from '@storybook/react-vite'

import { SearchField } from './SearchField'

const meta = {
  title: 'Components/SearchField',
  component: SearchField,
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof SearchField>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    placeholder: 'Search for playlists...',
  },
}
