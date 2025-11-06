import type { ReactNode } from 'react'

import {
  CurrentUserReaction,
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/shared/components'
import { ClockIcon } from '@/shared/icons'

type TableColumn = {
  title: ReactNode
  width?: string
}

const TABLE_COLUMNS: TableColumn[] = [
  {
    title: '#',
    width: '40px',
  },
  {
    title: 'Track',
  },
  {
    title: '',
  },
  {
    title: 'Date added',
    width: '120px',
  },
  {
    title: 'Actions',
    width: '150px',
  },
  {
    title: <ClockIcon />,
    width: '60px',
  },
]

export type TracksTableProps<T extends TrackRowData> = {
  trackRows: T[]
  renderTrackRow: (trackRow: T) => ReactNode
}

type ReactionsProps =
  | {
      likesCount: number
      dislikesCount: number
      currentUserReaction: CurrentUserReaction
    }
  | {
      likesCount?: undefined
      dislikesCount?: undefined
      currentUserReaction?: undefined
    }

export type TrackRowData = {
  index: number
  imageSrc?: string
  id: string
  title: string
  addedAt: string
  artists: string[]
  duration: number
  isOwner?: boolean
  url: string
} & ReactionsProps

export const TracksTable = <T extends TrackRowData>({
  trackRows = [],
  renderTrackRow,
}: TracksTableProps<T>) => {
  if (trackRows.length === 0) {
    return <div>No tracks</div>
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          {TABLE_COLUMNS.map((column, index) => (
            <TableHeaderCell key={index} style={{ width: column.width }}>
              {column.title}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>{trackRows.map((trackRow) => renderTrackRow(trackRow))}</TableBody>
    </Table>
  )
}
