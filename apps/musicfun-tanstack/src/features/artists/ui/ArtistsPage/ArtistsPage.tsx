import { PageTitle } from '@/common/components'
import { AddArtistForm } from './AddArtistForm/AddArtistForm.tsx'
import { ArtistsList } from './ArtistsList/ArtistsList.tsx'

export const ArtistsPage = () => {
  return (
    <>
      <PageTitle>Страница артистов</PageTitle>
      <AddArtistForm />
      <ArtistsList />
    </>
  )
}
