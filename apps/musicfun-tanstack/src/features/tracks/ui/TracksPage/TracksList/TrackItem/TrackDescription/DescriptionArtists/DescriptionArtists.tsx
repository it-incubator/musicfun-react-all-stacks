import type { Artist } from '@/features/artists/api/artistsApi.types.ts'

type Props = {
  artists: Artist[]
}

export const DescriptionArtists = ({ artists }: Props) => {
  return (
    <div>
      {!!artists.length && (
        <div>
          <b>Artists:</b>{' '}
          <div className={'artistList'}>
            {artists.map((a) => {
              return (
                <div key={a.id} className={'artistItem'}>
                  {`🎙️ ${a.name}`}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
