import type { FetchTracksResponse } from '../../api/tracksApi.types'
import s from './TracksList.module.css'
import { ClockIcon } from '@/common/icons'
import { type ReactNode } from 'react'
import { TrackItem } from '@/features/tracks/ui/TracksList/TrackItem/TrackItem.tsx'

type Props = {
  tracks?: FetchTracksResponse
  page: number
  pageSize: number
  isReactionMutable?: boolean
}

type Column = {
  title?: string
  style?: string
  icon?: ReactNode
}

const COLUMNS: Column[] = [
  { title: '#', style: s.numTrack },
  { title: 'title', style: s.description },
  { style: s.player },
  { title: 'data added', style: s.date },
  { style: s.actions, icon: <ClockIcon fillColor={'#000'} /> },
]

export const TracksList = ({ tracks, pageSize, page, isReactionMutable = false }: Props) => {
  return (
    <div className={s.tracksList}>
      <div className={s.header}>
        {COLUMNS.map((col, i) => (
          <div key={i} className={col.style}>
            <span>{col.title}</span>
            {col.icon}
          </div>
        ))}
      </div>
      {tracks?.data?.map((track, index) => {
        return (
          <TrackItem
            track={track}
            isReactionMutable={isReactionMutable}
            index={index}
            pageSize={pageSize}
            page={page}
          />
        )
      })}
    </div>
  )
}
