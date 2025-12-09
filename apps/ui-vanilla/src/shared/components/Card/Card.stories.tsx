import type { Meta, StoryObj } from '@storybook/react-vite'

import { Typography } from '../Typography'
import { Card } from './Card'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <Card>
      <Typography variant="h2">Chill Mix</Typography>
      <Typography variant="body2" style={{ color: 'var(--color-text-secondary)' }}>
        Julia Wolf, Khalid, ayokay and more
      </Typography>
    </Card>
  ),
}

export const AsSection: Story = {
  render: () => (
    <Card as="section">
      <Typography variant="h3">Card as section</Typography>
      <Typography variant="caption">You can use any tag via 'as' prop</Typography>
    </Card>
  ),
}
