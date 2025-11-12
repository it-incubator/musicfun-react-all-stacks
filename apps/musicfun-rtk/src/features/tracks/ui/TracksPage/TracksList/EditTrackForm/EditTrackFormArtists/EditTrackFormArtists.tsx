import type { Dispatch, SetStateAction } from 'react'
import s from '../EditTrackForm.module.css'
import { useFindArtistsQuery } from '@/features/artists/api/artistsApi.ts'

type Props = {
  artistsIds: string[]
  setArtistsIds: Dispatch<SetStateAction<string[]>>
}

export const EditTrackFormArtists = ({ artistsIds, setArtistsIds }: Props) => {
  const { data: artistsResponse } = useFindArtistsQuery('')

  const toggleArtist = (artistId: string) => {
    setArtistsIds((prev) => (prev.includes(artistId) ? prev.filter((id) => id !== artistId) : [...prev, artistId]))
  }

  return (
    <div>
      <h4 className={s.subTitle}>Select Artist from List</h4>
      <div className={'artistList'}>
        {artistsResponse?.map((artist) => {
          const isSelected = artistsIds.includes(artist.id)
          return (
            <div
              key={artist.id}
              onClick={() => toggleArtist(artist.id)}
              className={`artistItem ${isSelected ? 'selectedArtist' : ''}`}
            >
              🎙️ {artist.name}
            </div>
          )
        })}
      </div>
    </div>
  )
}
