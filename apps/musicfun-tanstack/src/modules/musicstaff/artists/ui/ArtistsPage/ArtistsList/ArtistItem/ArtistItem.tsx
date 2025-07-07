import { artistsKey } from '@/common/apiEntities'
import { artistsApi } from '../../../../api/artistsApi.ts'
import type { Artist } from '../../../../api/artistsApi.types.ts'
import { queryClient } from '@/main.tsx'
import { useMutation } from '@tanstack/react-query'
import s from './ArtistItem.module.css'

type Props = {
  artist: Artist
}

export const ArtistItem = ({ artist }: Props) => {
  const { name, id } = artist

  const { mutate, isPending: isRemoving } = useMutation({
    mutationFn: artistsApi.removeArtist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [artistsKey] }),
  })

  return (
    <div className={`item item--fullwidth flex-container ${s.container}`}>
      <div>
        <b>Name:</b> <span>{name}</span>
      </div>
      <button onClick={() => mutate(id)} disabled={isRemoving}>
        {isRemoving ? 'Удаление...' : 'Удалить'}
      </button>
    </div>
  )
}
