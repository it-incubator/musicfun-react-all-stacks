import s from './TracksList.module.css'
import { ClockIcon } from '@/common/icons'
import { type ReactNode } from 'react'
import { TrackItem } from '@/features/tracks/ui/TracksList/TrackItem/TrackItem.tsx'
import type { FetchTracksAttributes, TrackDetails } from '@/features/tracks/api/tracksApi.types.ts'

type Props = {
  tracks?: TrackDetails<FetchTracksAttributes>[]
  page: number
  pageSize: number
  isReactionMutable?: boolean
}

type Column = {
  id: string
  title?: string
  style?: string
  icon?: ReactNode
}

const COLUMNS: Column[] = [
  { id: 'number', title: '#', style: s.numTrack },
  { id: 'title', title: 'title', style: s.description },
  { id: 'player', style: s.player },
  { id: 'date', title: 'data added', style: s.date },
  { id: 'actions', style: s.actions, icon: <ClockIcon fillColor={'#000'} /> },
]

export const TracksList = ({ tracks, pageSize, page, isReactionMutable = false }: Props) => {
  return (
    <div className={s.tracksList}>
      <div className={s.header}>
        {COLUMNS.map((col) => (
          <div key={col.id} className={col.style}>
            <span>{col.title}</span>
            {col.icon}
          </div>
        ))}
      </div>
      {tracks?.map((track, index) => {
        return (
          <TrackItem
            key={track.id}
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
