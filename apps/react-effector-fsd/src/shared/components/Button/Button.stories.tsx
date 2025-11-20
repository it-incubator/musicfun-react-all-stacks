import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const AllButtons: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '24px',
        flexDirection: 'column',
        alignItems: 'center',
        width: '250px',
      }}
    >
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button fullWidth>Full Width</Button>
      <Button disabled>Disabled</Button>
      <Button variant="primary" as="p" href="https://it-incubator.io/" target="_blank">
        Link
      </Button>
    </div>
  ),
}
