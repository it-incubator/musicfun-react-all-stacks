import {useTranslation} from 'react-i18next'

import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/shared/components'

import {LikedTracksTab} from './LikedTracksTab'
import {MyLikedPlaylistsTab} from './MyLikedPlaylistsTab'
import {PlaylistsTab} from './PlaylistsTab'
import {TracksTab} from './TracksTab/TracksTab'
import {useGetUserPageData} from "@/pages/UserPage/model";

export const UserTabs = () => {
    const {t} = useTranslation()
    const {isProfileOwner, userName} = useGetUserPageData()

    return (
        <Tabs defaultValue="playlists">
            <TabsList>
                <TabsTrigger value="playlists">{t('tabs.playlists')}
                    {!isProfileOwner && userName && ` ${userName}'s`}</TabsTrigger>
                <TabsTrigger value="tracks">{t('tabs.tracks')}
                    {!isProfileOwner && userName && ` ${userName}'s`}</TabsTrigger>
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
