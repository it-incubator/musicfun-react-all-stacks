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
        <DropdownMenuItem onClick={() => alert('Add to playlist clicked!')}>Add to playlist</DropdownMenuItem>
        <DropdownMenuItem onClick={() => alert('Show text song clicked!')}>Show text song</DropdownMenuItem>
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
      <DropdownMenuTrigger asChild>
        <IconButton aria-label="More options">
          <MoreIcon />
        </IconButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => alert('Action 1')}>Action 1</DropdownMenuItem>
        <DropdownMenuItem onClick={() => alert('Action 2')}>Action 2</DropdownMenuItem>
        <DropdownMenuItem onClick={() => alert('Action 3')}>Action 3</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const DifferentAlignments: Story = {
  args: {},
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '100px',
        padding: '100px',
        alignItems: 'center',
        backgroundColor: 'var(--color-bg-secondary)',
      }}
    >
      <div>
        <Typography variant="caption" style={{ display: 'block', marginBottom: '8px' }}>
          Align Start
        </Typography>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreIcon />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Add to playlist</DropdownMenuItem>
            <DropdownMenuItem>Show text song</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <Typography variant="caption" style={{ display: 'block', marginBottom: '8px' }}>
          Align Center
        </Typography>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreIcon />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="center">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Add to playlist</DropdownMenuItem>
            <DropdownMenuItem>Show text song</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <Typography variant="caption" style={{ display: 'block', marginBottom: '8px' }}>
          Align End (default)
        </Typography>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreIcon />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Add to playlist</DropdownMenuItem>
            <DropdownMenuItem>Show text song</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
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
        <DropdownMenuItem as="a" href="https://example.com" target="_blank" onClick={() => console.log('Link clicked')}>
          <PlusIcon />
          Visit Website
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => alert('Show text song')}>Show text song</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const Interactive: Story = {
  args: {},
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center',
        padding: '40px',
      }}
    >
      <Typography variant="h3">Click the menu buttons to test functionality</Typography>

      <div style={{ display: 'flex', gap: '20px' }}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreIcon />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => console.log('Edit clicked')}>
              <CreateIcon />
              Edit track
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Add to playlist clicked')}>
              <PlusIcon />
              Add to playlist
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              as="a"
              href="https://example.com"
              target="_blank"
              onClick={() => console.log('External link clicked')}
            >
              Show lyrics online
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Download clicked')}>Download</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Share (coming soon)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton aria-label="Playlist options">
              <MoreIcon />
            </IconButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => console.log('Edit playlist')}>Edit playlist</DropdownMenuItem>
            <DropdownMenuItem as="a" href="/share/playlist" onClick={() => console.log('Share playlist')}>
              Share playlist
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Delete playlist')}>Delete playlist</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Typography variant="caption">Open browser console to see click events</Typography>
    </div>
  ),
}
