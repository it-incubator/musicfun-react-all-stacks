import { Tabs, TabsContent, TabsList, TabsTrigger, Typography } from '@/shared/components'

import { LikedTracksTab } from './LikedTracksTab'
import { MyLikedPlaylistsTab } from './MyLikedPlaylistsTab'
import { PlaylistsTab } from './PlaylistsTab'
import { TracksTab } from './TracksTab/TracksTab'

export const UserTabs = () => {
  const isProfileOwner = true // STATE FOR TESTING

  return (
    <Tabs defaultValue="playlists">
      <TabsList>
        <TabsTrigger value="playlists">Playlists</TabsTrigger>
        <TabsTrigger value="tracks">Tracks</TabsTrigger>
        {isProfileOwner && (
          <>
            <TabsTrigger value="liked-playlists">Liked Playlists</TabsTrigger>
            <TabsTrigger value="liked-tracks">Liked Tracks</TabsTrigger>
          </>
        )}
      </TabsList>
      <TabsContent value="playlists">
        <PlaylistsTab />
      </TabsContent>
      <TabsContent value="tracks">
        <TracksTab />
      </TabsContent>
      {isProfileOwner && (
        <>
          <TabsContent value="liked-playlists">
            <MyLikedPlaylistsTab />
          </TabsContent>
          <TabsContent value="liked-tracks">
            <LikedTracksTab />
          </TabsContent>
        </>
      )}
    </Tabs>
  )
}
