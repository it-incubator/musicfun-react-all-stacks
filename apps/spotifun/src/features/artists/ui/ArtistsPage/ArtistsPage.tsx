import { PageTitle } from "@/common/components"
import { AddArtistForm } from "@/features/artists/ui/ArtistsPage/AddArtistForm/AddArtistForm.tsx"
import { ArtistsList } from "@/features/artists/ui/ArtistsPage/ArtistsList/ArtistsList.tsx"

export const ArtistsPage = () => {
  return (
    <>
      <PageTitle>Страница артистов</PageTitle>
      <AddArtistForm />
      <ArtistsList />
    </>
  )
}
