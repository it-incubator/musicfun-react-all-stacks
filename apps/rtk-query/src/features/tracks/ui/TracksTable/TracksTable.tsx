import { t } from 'i18next'
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
  isPublished?: boolean
  url: string
} & ReactionsProps

const TABLE_COLUMNS: TableColumn[] = [
  { title: '#', width: '40px' },
  { title: t('tracks.table.track') },
  { title: '' },
  { title: t('tracks.table.date_added'), width: '120px' },
  { title: t('tracks.table.actions'), width: '150px' },
  { title: <ClockIcon />, width: '60px' },
]

export const TracksTable = <T extends TrackRowData>({
  trackRows = [],
  renderTrackRow,
}: TracksTableProps<T>) => {
  if (trackRows.length === 0) {
    return <div>{t('tracks.label.no_tracks')}</div>
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
