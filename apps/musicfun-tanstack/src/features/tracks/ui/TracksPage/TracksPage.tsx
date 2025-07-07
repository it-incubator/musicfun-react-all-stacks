import { PageTitle } from '@/common/components'
import { AddTrackForm } from './AddTrackForm/AddTrackForm.tsx'
import { TracksList } from './TracksList/TracksList.tsx'

export const TracksPage = () => {
  return (
    <>
      <PageTitle>Страница треков</PageTitle>
      <AddTrackForm />
      <TracksList />
    </>
  )
}
