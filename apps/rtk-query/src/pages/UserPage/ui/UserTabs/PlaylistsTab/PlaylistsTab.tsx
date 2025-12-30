import {useTranslation} from 'react-i18next'

import { PlaylistActions, PlaylistCard, useCreatePlaylistModal } from '@/features/playlists'
import { ContentList } from '@/pages/common'
import { useOwnerData } from '@/pages/UserPage/hooks'
import { Button } from '@/shared/components'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import s from './PlaylistsTab.module.css'

export const PlaylistsTab = () => {
    const {t} = useTranslation()
    const {isProfileOwner, playlists} = useOwnerData()

  const { handleOpenCreatePlaylistModal } = useCreatePlaylistModal()

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
                actions={isProfileOwner && <PlaylistActions playlistId={playlist.id} />}
              />
            )
          }}
        />
      )}
    </>
  )
}
