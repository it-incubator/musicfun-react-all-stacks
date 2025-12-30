import {useTranslation} from 'react-i18next'

import { useOwnerData } from '@/pages/UserPage/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components'

import { LikedTracksTab } from './LikedTracksTab'
import { MyLikedPlaylistsTab } from './MyLikedPlaylistsTab'
import { PlaylistsTab } from './PlaylistsTab'
import { TracksTab } from './TracksTab/TracksTab'

export const UserTabs = () => {
    const {t} = useTranslation()
    const {isProfileOwner, userLogin} = useOwnerData()

    return (
        <Tabs defaultValue="playlists">
            <TabsList>
                <TabsTrigger value="playlists">{t('tabs.playlists')}
                    {!isProfileOwner && userLogin && ` ${userLogin}${t('tabs.possessive_case')}`}</TabsTrigger>
                <TabsTrigger value="tracks">{t('tabs.tracks')}
                    {!isProfileOwner && userLogin && ` ${userLogin}${t('tabs.possessive_case')}`}</TabsTrigger>
                {isProfileOwner && (
                    <>
                        <TabsTrigger value="liked-playlists">{t('tabs.liked_playlists')}</TabsTrigger>
                        <TabsTrigger value="liked-tracks">{t('tabs.liked_tracks')}</TabsTrigger>
                    </>
                )}
            </TabsList>
            <TabsContent value="playlists">
                <PlaylistsTab/>
            </TabsContent>
            <TabsContent value="tracks">
                <TracksTab/>
            </TabsContent>
            {isProfileOwner && (
                <>
                    <TabsContent value="liked-playlists">
                        <MyLikedPlaylistsTab/>
                    </TabsContent>
                    <TabsContent value="liked-tracks">
                        <LikedTracksTab/>
                    </TabsContent>
                </>
            )}
        </Tabs>
    )
}
