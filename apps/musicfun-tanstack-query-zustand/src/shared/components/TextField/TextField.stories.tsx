import type { Meta, StoryObj } from '@storybook/react-vite'

import { SearchIcon } from '@/shared/icons'

import { TextField } from './TextField'

const meta = {
  title: 'Components/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    label: 'Some label',
    placeholder: 'Some placeholder',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Some label',
    placeholder: 'Some placeholder',
    disabled: true,
  },
}

export const Error: Story = {
  args: {
    label: 'Some label',
    placeholder: 'Some placeholder',
    errorMessage: 'Some error message',
  },
}

export const Search: Story = {
  args: {
    label: 'Some label',
    placeholder: 'Some placeholder',
    icon: <SearchIcon width={20} height={20} />,
    inputSize: 'l',
  },
}
