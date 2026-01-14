import type { Meta, StoryObj } from '@storybook/react-vite'

import { Spinner } from './Spinner.tsx'

const meta = {
  argTypes: {
    size: {
      control: { type: 'number' },
    },
    fullScreen: {
      control: { type: 'boolean' },
    },
  },
  component: Spinner,
  tags: ['autodocs'],
  title: 'Components/Spinner',
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    fullScreen: false,
    size: 48,
  },
}

export const FullScreen: Story = {
  args: {
    fullScreen: true,
    size: 100,
  },
}
