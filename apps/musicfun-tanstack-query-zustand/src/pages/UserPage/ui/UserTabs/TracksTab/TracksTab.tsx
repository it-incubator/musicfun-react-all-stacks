// import { useState } from 'react'

import { MOCK_TRACKS, TracksTable } from '@/features/tracks'
import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import { Button } from '@/shared/components'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components'
import { MoreIcon } from '@/shared/icons'

import s from './TracksTab.module.css'

export const TracksTab = () => {
  // const [isUploadTrackModalOpen, setIsUploadTrackModalOpen] = useState(false) // STATE FOR TESTING

  const openUploadTrackModal = () => {
    // setIsUploadTrackModalOpen(true)
  }

  // todo:task load user tracks

  return (
    <>
      <Button className={s.uploadTrackButton} onClick={openUploadTrackModal}>
        Upload Track
      </Button>
      <TracksTable
        trackRows={MOCK_TRACKS.map((track, index) => ({
          index,
          id: track.id,
          title: track.attributes.title,
          image: track.attributes.images.main[0].url,
          addedAt: track.attributes.addedAt,
          artists: track.attributes.artists?.map((artist) => artist.name) || [],
          duration: track.attributes.duration,
        }))}
        renderTrackRow={(trackRow) => (
          <TrackRow
            trackRow={trackRow}
            renderActionsCell={() => (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {/* todo:task if it's current logined user track, show edit popup and implement edit */}
                  <DropdownMenuItem onClick={() => alert('Edit clicked!')}>Edit</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      // todo:task implement feature
                      alert('Add to playlist clicked!')
                    }}>
                    Add to playlist
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => alert('Show text song clicked!')}>
                    Show text song
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        )}
      />
    </>
  )
}
