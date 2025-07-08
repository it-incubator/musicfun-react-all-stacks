import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tag } from './Tag.tsx'

const meta = {
  title: 'Components/Hashtag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  args: {
    tag: 'Playlists',
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Active: Story = {
  args: {
    active: true,
  },
}

export const AsLink: Story = {
  args: {
    as: 'a',
    href: 'https://www.google.com',
    target: '_blank',
  },
}

export const AllHashtags: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Tag tag="Playlists" />
      <Tag active tag="Artists" />
      <Tag tag="Albums" />
      <Tag as="a" href="#" tag="Podcasts & shows">
        Podcasts & shows
      </Tag>
    </div>
  ),
}
