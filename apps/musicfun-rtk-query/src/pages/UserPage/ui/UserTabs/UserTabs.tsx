import { useTranslation } from 'react-i18next'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components'

import { LikedTracksTab } from './LikedTracksTab'
import { MyLikedPlaylistsTab } from './MyLikedPlaylistsTab'
import { PlaylistsTab } from './PlaylistsTab'
import { TracksTab } from './TracksTab/TracksTab'

export const UserTabs = () => {
  const { t } = useTranslation()

  const isProfileOwner = true // STATE FOR TESTING

  return (
    <Tabs defaultValue="playlists">
      <TabsList>
        <TabsTrigger value="playlists">{t('tabs.playlists')}</TabsTrigger>
        <TabsTrigger value="tracks">{t('tabs.tracks')}</TabsTrigger>
        {isProfileOwner && (
          <>
            <TabsTrigger value="liked-playlists">{t('tabs.liked_playlists')}</TabsTrigger>
            <TabsTrigger value="liked-tracks">{t('tabs.liked_tracks')}</TabsTrigger>
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
