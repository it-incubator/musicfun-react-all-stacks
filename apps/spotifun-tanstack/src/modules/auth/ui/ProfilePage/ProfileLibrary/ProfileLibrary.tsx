import { UserLikedPlaylists } from './UserLikedPlaylists/UserLikedPlaylists.tsx'
import { UserLikedTracks } from './UserLikedTracks/UserLikedTracks.tsx'
import { UserPlaylists } from './UserPlaylists/UserPlaylists.tsx'
import { UserTracks } from './UserTracks/UserTracks.tsx'

export const ProfileLibrary = () => {
  return (
    <>
      <UserPlaylists />
      <UserTracks />
      <UserLikedPlaylists />
      <UserLikedTracks />
    </>
  )
}
