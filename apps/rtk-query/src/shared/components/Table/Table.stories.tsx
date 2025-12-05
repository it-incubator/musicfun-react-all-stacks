import type { Meta, StoryObj } from '@storybook/react-vite'

import { ReactionButtons } from '../ReactionButtons'
import { Typography } from '../Typography'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from './Table'
import s from './Table.module.css'

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const trackData = [
  {
    id: 1,
    title: 'Play It Safe',
    artist: 'Julia Wolf',
    image: 'https://picsum.photos/40/40?random=1',
    dateAdded: '1 day ago',
    duration: '2:12',
  },
  {
    id: 2,
    title: 'Ocean Front Apt.',
    artist: 'ayokay',
    image: 'https://picsum.photos/40/40?random=2',
    dateAdded: '1 day ago',
    duration: '2:12',
  },
  {
    id: 3,
    title: 'Free Spirit',
    artist: 'Khalid',
    image: 'https://picsum.photos/40/40?random=3',
    dateAdded: '2 day ago',
    duration: '3:02',
  },
  {
    id: 4,
    title: 'Remind You',
    artist: 'FRENSHIP',
    image: 'https://picsum.photos/40/40?random=4',
    dateAdded: '3 day ago',
    duration: '4:25',
  },
]

export const BasicTable = {
  render: () => (
    <div style={{ width: '600px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>john@example.com</TableCell>
            <TableCell>Admin</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane Smith</TableCell>
            <TableCell>jane@example.com</TableCell>
            <TableCell>User</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Bob Johnson</TableCell>
            <TableCell>bob@example.com</TableCell>
            <TableCell>Editor</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
}

export const EmptyTable = {
  render: () => (
    <div style={{ width: '500px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Column&nbsp;1</TableHeaderCell>
            <TableHeaderCell>Column&nbsp;2</TableHeaderCell>
            <TableHeaderCell>Column&nbsp;3</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={3}>
              <Typography variant="body2" style={{ textAlign: 'center', padding: '40px 20px' }}>
                No data available
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
}
