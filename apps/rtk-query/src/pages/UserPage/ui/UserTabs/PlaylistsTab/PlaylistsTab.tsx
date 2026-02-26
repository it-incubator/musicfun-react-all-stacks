import { useTranslation } from 'react-i18next'

import {
  PlaylistActions,
  PlaylistCard,
  useCreatePlaylistModal,
  useFetchPlaylistsQuery,
} from '@/features/playlists'
import { ContentList } from '@/pages/common'
import { useOwnerData } from '@/pages/UserPage/hooks'
import { Button, Pagination } from '@/shared/components'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { usePageSearchParams } from '@/pages/common/hooks'
import s from './PlaylistsTab.module.css'

export const PlaylistsTab = () => {
  const { t } = useTranslation()
  const { isProfileOwner, pageOwnerId } = useOwnerData()
  const { pageNumber, handlePageChange } = usePageSearchParams()

  const { data: playlistsResponse, isLoading } = useFetchPlaylistsQuery({
    userId: pageOwnerId,
    pageNumber,
    pageSize: 8,
  })

  const { handleOpenCreatePlaylistModal } = useCreatePlaylistModal()

  if (isLoading) return null

  return (
    <>
      {isProfileOwner && (
        <Button className={s.createPlaylistButton} onClick={handleOpenCreatePlaylistModal}>
          {t('playlists.button.create_playlist')}
        </Button>
      )}

      {playlistsResponse?.data && playlistsResponse.data.length > 0 && (
        <ContentList
          data={playlistsResponse.data}
          listClassName={s.playlistsList}
          renderItem={(playlist) => {
            const image = getImageByType(playlist.attributes.images, ImageType.MEDIUM)
            return (
              <PlaylistCard
                id={playlist.id}
                title={playlist.attributes.title}
                imageSrc={image?.url}
                tracksCount={playlist.attributes.tracksCount}
                actions={isProfileOwner && <PlaylistActions playlistId={playlist.id} />}
              />
            )
          }}
        />
      )}

      {playlistsResponse && (
        <Pagination
          page={pageNumber}
          pagesCount={playlistsResponse.meta.pagesCount || 1}
          onPageChange={handlePageChange}
          alwaysVisible
        />
      )}
      {playlistsResponse?.data && playlistsResponse.data.length === 0 && (
        <div className={s.emptyState}>{t('playlists.title.no_playlists')}</div>
      )}
    </>
  )
}
