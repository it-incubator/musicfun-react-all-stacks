import type {
  BaseAttributes,
  FetchTracksAttributes,
  PlaylistItemAttributes,
  TrackDetailAttributes,
} from '../../../../../api/tracksApi.types.ts'
import { DescriptionArtists } from './DescriptionArtists/DescriptionArtists.tsx'
import { DescriptionTags } from './DescriptionTags/DescriptionTags.tsx'

type Props<T extends BaseAttributes> = {
  attributes: T
}

export const TrackDescription = <T extends BaseAttributes>({ attributes }: Props<T>) => {
  const { title, addedAt } = attributes

  const { order } = attributes as Partial<PlaylistItemAttributes>
  const { user } = attributes as Partial<FetchTracksAttributes>
  const { lyrics, likesCount, dislikesCount, tags, artists } = attributes as Partial<TrackDetailAttributes>

  return (
    <div className={'flex-container-column'}>
      <div> Title: {title} </div>
      <div> Added date: {new Date(addedAt).toLocaleDateString()} </div>
      <div>{lyrics ? <>Lyrics: {lyrics}</> : null} </div>
      <div>{likesCount !== undefined ? <>Likes count: {likesCount}</> : null} </div>
      <div>{dislikesCount !== undefined ? <>Dislikes count: {dislikesCount}</> : null} </div>
      <div>{order !== undefined ? <>Order: {order}</> : null} </div>
      <div>{user ? <>User: {user.name}</> : null} </div>
      <DescriptionTags tags={tags || []} />
      <DescriptionArtists artists={artists || []} />
    </div>
  )
}
