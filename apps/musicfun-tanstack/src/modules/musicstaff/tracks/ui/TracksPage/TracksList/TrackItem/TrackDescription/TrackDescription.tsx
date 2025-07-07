import type { TrackOutputAttributes } from '../../../../../api/tracksApi.types.ts'
import { DescriptionArtists } from './DescriptionArtists/DescriptionArtists.tsx'
import { DescriptionTags } from './DescriptionTags/DescriptionTags.tsx'

type Props = {
  attributes: TrackOutputAttributes
}

export const TrackDescription = ({ attributes }: Props) => {
  const { title, addedAt } = attributes

  //const { order } = attributes
  //const { user } = attributes
  const { lyrics, likesCount, dislikesCount, tags, artists } = attributes

  return (
    <div className={'flex-container-column'}>
      <div> Title: {title} </div>
      <div> Added date: {new Date(addedAt).toLocaleDateString()} </div>
      <div>{lyrics ? <>Lyrics: {lyrics}</> : null} </div>
      <div>{likesCount !== undefined ? <>Likes count: {likesCount}</> : null} </div>
      <div>{dislikesCount !== undefined ? <>Dislikes count: {dislikesCount}</> : null} </div>
      {/*<div>{order !== undefined ? <>Order: {order}</> : null} </div>*/}
      {/*<div>{user ? <>User: {user.name}</> : null} </div>*/}
      <DescriptionTags tags={tags || []} />
      <DescriptionArtists artists={artists || []} />
    </div>
  )
}
