import { artistsKey } from '@/common/apiEntities'
import { artistsApi } from '@/modules/musicstaff/artists/api/artistsApi.ts'
import { useQuery } from '@tanstack/react-query'
import type { Dispatch, SetStateAction } from 'react'
import s from '../EditTrackForm.module.css'

type Props = {
  artistsIds: string[]
  setArtistsIds: Dispatch<SetStateAction<string[]>>
}

export const EditTrackFormArtists = ({ artistsIds, setArtistsIds }: Props) => {
  const { data: artistsResponse } = useQuery({ queryKey: [artistsKey], queryFn: () => artistsApi.findArtists('') })

  const toggleArtist = (artistId: string) => {
    setArtistsIds((prev) => (prev.includes(artistId) ? prev.filter((id) => id !== artistId) : [...prev, artistId]))
  }

  return (
    <div>
      <h4 className={s.subTitle}>Выбери артиста из списка</h4>
      <div className={'artistList'}>
        {artistsResponse?.data.map((artist) => {
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
