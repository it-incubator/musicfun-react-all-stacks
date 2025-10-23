import type { Meta, StoryObj } from '@storybook/react-vite'

import { DownloadIcon, HomeIcon, LikeIcon, MoreIcon, PlayIcon, PlusIcon, SearchIcon } from '@/shared/icons'

import { IconButton } from './IconButton'

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    children: <PlayIcon />,
    'aria-label': 'Play',
  },
}

export const AllIcons = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <IconButton aria-label="Home">
        <HomeIcon />
      </IconButton>

      <IconButton aria-label="Search">
        <SearchIcon />
      </IconButton>

      <IconButton aria-label="Play">
        <PlayIcon />
      </IconButton>

      <IconButton aria-label="Like">
        <LikeIcon />
      </IconButton>

      <IconButton aria-label="Add">
        <PlusIcon />
      </IconButton>

      <IconButton aria-label="More options">
        <MoreIcon />
      </IconButton>

      <IconButton aria-label="Download">
        <DownloadIcon />
      </IconButton>
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    children: <PlayIcon />,
    disabled: true,
  },
}
