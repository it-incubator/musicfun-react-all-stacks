import type { Meta, StoryObj } from '@storybook/react-vite'

import { Textarea } from './Textarea'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof Textarea>

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

export const WithRows: Story = {
  args: {
    label: 'Some label',
    placeholder: 'Some placeholder',
    rows: 5,
  },
}
