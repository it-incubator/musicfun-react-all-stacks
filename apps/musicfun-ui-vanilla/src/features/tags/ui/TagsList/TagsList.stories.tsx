import type { Meta, StoryObj } from '@storybook/react-vite'

import { MOCK_HASHTAGS } from '../../api/tags-api'
import { TagsList } from './TagsList'

const meta: Meta<typeof TagsList> = {
  title: 'entities/TagsList',
  component: TagsList,
}

export default meta

type Story = StoryObj<typeof TagsList>

export const Default: Story = {
  args: {
    tags: MOCK_HASHTAGS,
  },
}
