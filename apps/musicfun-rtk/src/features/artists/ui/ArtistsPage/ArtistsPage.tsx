import { ArtistsList } from '@/features/artists/ui/ArtistsPage/ArtistsList/ArtistsList.tsx'
import { AddArtistForm } from '@/features/artists/ui/ArtistsPage/AddArtistForm/AddArtistForm.tsx'
import { PageTitle } from '@/common/components'

export const ArtistsPage = () => {
  return (
    <>
      <PageTitle>Artists Page</PageTitle>
      <AddArtistForm />
      <ArtistsList />
    </>
  )
}
