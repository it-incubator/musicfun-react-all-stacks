import { Path } from '@/common/routing'
import type { BaseAttributes, TrackDetails } from '../../../../api/tracksApi.types.ts'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { TrackPlayer } from '@/features/tracks/ui/TracksPage/TracksList/TrackItem/TrackPlayer/TrackPlayer.tsx'
import { TrackCover } from './TrackCover/TrackCover.tsx'
import { TrackDescription } from './TrackDescription/TrackDescription.tsx'
import s from './TrackItem.module.css'

type Props<T extends BaseAttributes> = {
  track: TrackDetails<T>
  children?: ReactNode
}

export const TrackItem = <T extends BaseAttributes>({ children, track }: Props<T>) => {
  return (
    <Link to={`${Path.Tracks}/${track.id}`} className={s.link}>
      <div className={`item item--fullwidth flex-container`}>
        <div className={`flex-container ${s.container}`}>
          <TrackCover track={track} />
          <TrackDescription<T> attributes={track.attributes} />
          <TrackPlayer track={track} />
        </div>
        {children}
      </div>
    </Link>
  )
}
