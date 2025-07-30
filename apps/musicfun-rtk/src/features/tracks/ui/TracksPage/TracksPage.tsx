import { PageTitle } from '@/common/components'
import { TracksList } from './TracksList/TracksList.tsx'
import { AddTrackForm } from '@/features/tracks/ui/TracksPage/AddTrackForm/AddTrackForm.tsx'

export const TracksPage = () => {
  return (
    <>
      <PageTitle>Tracks Page</PageTitle>
      <AddTrackForm />
      <TracksList />
    </>
  )
}
