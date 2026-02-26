import { t } from 'i18next'
import { useParams, useSearchParams } from 'react-router'

import {
  PlaylistCard,
  useCreatePlaylistModal,
  useEditPlaylistModal,
  useFetchPlaylistsQuery,
  useRemovePlaylistMutation,
} from '@/features/playlists'
import { ContentList } from '@/pages/common'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Pagination,
} from '@/shared/components'
import { MoreIcon } from '@/shared/icons'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'
import s from './MyLikedPlaylistsTab.module.css'

export const MyLikedPlaylistsTab = () => {
  const { userId } = useParams()

  const { handleOpenEditPlaylistModal } = useEditPlaylistModal()
  const [removePlaylist] = useRemovePlaylistMutation()

  const [searchParams, setSearchParams] = useSearchParams()

  const pageNumber = Number(searchParams.get('page')) || 1
  const { data: playlists, isLoading } = useFetchPlaylistsQuery({ pageNumber, userId: userId! })
  const pagesCount = playlists?.meta.pagesCount || 1

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      if (page === 1) {
        prev.delete('page')
      } else {
        prev.set('page', page.toString())
      }
      return prev
    })
  }

  return (
    <>
      {playlists?.data && (
        <ContentList
          data={playlists?.data}
          listClassName={s.playlistsList}
          renderItem={(playlist) => {
            const image = getImageByType(playlist.attributes.images, ImageType.MEDIUM)
            return (
              <PlaylistCard
                id={playlist.id}
                title={playlist.attributes.title}
                imageSrc={image?.url}
                userName={playlist.attributes.user.name}
                isShowReactionButtons={true}
                reaction={playlist.attributes.currentUserReaction}
                likesCount={playlist.attributes.likesCount}
                userId={playlist.attributes.user.id}
                addedAt={playlist.attributes.addedAt}
                tracksCount={playlist.attributes.tracksCount}
                shouldShowOwnerName
                shouldShowCreatedDate
                actions={
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreIcon />
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
      {!isLoading && (
        <Pagination
          page={pageNumber}
          pagesCount={pagesCount}
          onPageChange={handlePageChange}
          alwaysVisible
        />
      )}
    </>
  )
}
