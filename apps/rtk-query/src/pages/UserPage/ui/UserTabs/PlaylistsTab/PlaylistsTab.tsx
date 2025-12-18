import {useTranslation} from 'react-i18next'

import {
    PlaylistCard,
    useCreatePlaylistModal,
    useEditPlaylistModal,
    useRemovePlaylistMutation,
} from '@/features/playlists'
import {ContentList} from '@/pages/common'
import {Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from '@/shared/components'
import {MoreIcon} from '@/shared/icons'
import {ImageType} from '@/shared/types/commonApi.types'
import {getImageByType} from '@/shared/utils'

import s from './PlaylistsTab.module.css'
import {useOwnerData} from "@/pages/UserPage/hooks";

export const PlaylistsTab = () => {
    const {t} = useTranslation()
    const {isProfileOwner, playlists} = useOwnerData()

    const {handleOpenCreatePlaylistModal} = useCreatePlaylistModal()
    const {handleOpenEditPlaylistModal} = useEditPlaylistModal()
    const [removePlaylist] = useRemovePlaylistMutation()

    return (
        <>
            {isProfileOwner && <Button className={s.createPlaylistButton} onClick={handleOpenCreatePlaylistModal}>
                {t('playlists.button.create_playlist')}
            </Button>}

            {playlists?.data && (
                <ContentList
                    data={playlists?.data}
                    renderItem={(playlist) => {
                        const image = getImageByType(playlist.attributes.images, ImageType.MEDIUM)
                        return (
                            <PlaylistCard
                                id={playlist.id}
                                title={playlist.attributes.title}
                                imageSrc={image?.url}


                                actions={
                                    isProfileOwner && <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreIcon/>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    handleOpenEditPlaylistModal(playlist.id)
                                                }}>
                                                {t('button.edit')}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    removePlaylist(playlist.id)
                                                }}>
                                                {t('button.delete')}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                }
                            />
                        )
                    }}
                />
            )}
        </>
    )
}
