import type { Meta, StoryObj } from '@storybook/react-vite'

import { CreateIcon, MoreIcon, PlusIcon } from '@/shared/icons'

import { IconButton } from '../IconButton'
import { Typography } from '../Typography'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu'

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const BasicDropdownMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => alert('Edit clicked!')}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => alert('Add to playlist clicked!')}>
          Add to playlist
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => alert('Show text song clicked!')}>
          Show text song
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const WithIcons: Story = {
  args: {},
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => alert('Edit')}>
          <CreateIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => alert('Add to playlist')}>
          <PlusIcon />
          Add to playlist
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => alert('Show text song')}>Show text song</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const WithDisabledItem: Story = {
  args: {},
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => alert('Edit')}>Edit</DropdownMenuItem>
        <DropdownMenuItem disabled>Add to playlist (disabled)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => alert('Show text song')}>Show text song</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const CustomTrigger: Story = {
  args: {},
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>Trigger 🐯</DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => alert('Action 1')}>Action 1</DropdownMenuItem>
        <DropdownMenuItem onClick={() => alert('Action 2')}>Action 2</DropdownMenuItem>
        <DropdownMenuItem onClick={() => alert('Action 3')}>Action 3</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const WithLinks: Story = {
  args: {},
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => alert('Edit clicked')}>
          <CreateIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          as="a"
          href="https://example.com"
          target="_blank"
          onClick={() => console.log('Link clicked')}>
          <PlusIcon />
          Visit Website
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => alert('Show text song')}>Show text song</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
