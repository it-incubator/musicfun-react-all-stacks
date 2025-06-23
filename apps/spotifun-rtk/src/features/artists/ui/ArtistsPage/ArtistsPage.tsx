import { ArtistsList } from "@/features/artists/ui/ArtistsPage/ArtistsList/ArtistsList.tsx"
import { AddArtistForm } from "@/features/artists/ui/ArtistsPage/AddArtistForm/AddArtistForm.tsx"

export const ArtistsPage = () => {
  return (
    <>
      <h1>Страница артистов</h1>
      <AddArtistForm />
      <ArtistsList />
    </>
  )
}
