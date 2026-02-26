import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { useOwnerData } from '@/pages/UserPage/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components'

import { LikedTracksTab } from './LikedTracksTab'
import { MyLikedPlaylistsTab } from './MyLikedPlaylistsTab'
import { PlaylistsTab } from './PlaylistsTab'
import { TracksTab } from './TracksTab/TracksTab'
import { UserTabsSkeleton } from './UserTabsSkeleton'

export const UserTabs = () => {
  const { t } = useTranslation()
  const { isProfileOwner, userLogin, isContentLoading } = useOwnerData()
  const [searchParams, setSearchParams] = useSearchParams()

  const tabFromUrl = searchParams.get('tab') || 'playlists'
  const allowedTabs = isProfileOwner
    ? ['playlists', 'tracks', 'liked-playlists', 'liked-tracks']
    : ['playlists', 'tracks']
  const activeTab = allowedTabs.includes(tabFromUrl) ? tabFromUrl : 'playlists'

  useEffect(() => {
    if (tabFromUrl === activeTab) {
      return
    }

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('page')

      if (activeTab === 'playlists') {
        next.delete('tab')
      } else {
        next.set('tab', activeTab)
      }

      return next
    })
  }, [activeTab, setSearchParams, tabFromUrl])

  const handleTabChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('page')

      if (value === 'playlists') {
        next.delete('tab')
      } else {
        next.set('tab', value)
      }

      return next
    })
  }

  if (isContentLoading) {
    return <UserTabsSkeleton />
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="playlists">
          {t('tabs.playlists')}
          {!isProfileOwner && userLogin && ` ${userLogin}${t('tabs.possessive_case')}`}
        </TabsTrigger>
        <TabsTrigger value="tracks">
          {t('tabs.tracks')}
          {!isProfileOwner && userLogin && ` ${userLogin}${t('tabs.possessive_case')}`}
        </TabsTrigger>
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
