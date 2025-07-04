import { Path } from '@/common/routing'
import type { BaseAttributes, TrackDetails, TrackOutput } from '../../../../api/tracksApi.types.ts'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { TrackPlayer } from '@/modules/musicstaff/tracks/ui/TracksPage/TracksList/TrackItem/TrackPlayer/TrackPlayer.tsx'
import { TrackCover } from './TrackCover/TrackCover.tsx'
import { TrackDescription } from './TrackDescription/TrackDescription.tsx'
import s from './TrackItem.module.css'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getClient } from '@/common/api/client.ts'
import { tracksKey } from '@/common/apiEntities'

type Props<T extends BaseAttributes> = {
  track: TrackDetails<T>
  children?: ReactNode
}

type Props2 = {
  track: TrackOutput
  children?: ReactNode
}

export const TrackItem = ({ children, track }: Props2) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (trackId: string) => {
      return getClient().POST('/playlists/tracks/{trackId}/actions/publish', {
        params: {
          path: {
            trackId: trackId,
          },
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tracksKey] })
    },
  })

  return (
    <Link to={`${Path.Tracks}/${track.id}`} className={s.link}>
      <div className={`item item--fullwidth flex-container`}>
        <div className={`flex-container ${s.container}`}>
          <TrackCover trackId={track.id} images={track.attributes.images} />
          <TrackDescription attributes={track.attributes} />
          <TrackPlayer track={track} />

          {/*{!track.attributes.isPublished && (*/}
          {/*  <button*/}
          {/*    onClick={() => {*/}
          {/*      mutate(track.id)*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    Publish*/}
          {/*  </button>*/}
          {/*)}*/}

          <button
            onClick={() => {
              mutation.mutate(track.id)
            }}
          >
            Publish {mutation.isError && mutation.error.message}
          </button>
        </div>
        {children}
      </div>
    </Link>
  )
}
