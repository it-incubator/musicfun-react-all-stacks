import { t } from 'i18next'
import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router'

import {
  PlaylistCard,
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
import { DeleteConfirmationDialog } from '@/shared/components/DeleteConfirmationDialog'
import { MoreIcon } from '@/shared/icons'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

export const MyLikedPlaylistsTab = () => {
  const { userId } = useParams()

  const { handleOpenEditPlaylistModal } = useEditPlaylistModal()
  const [removePlaylist, { isLoading: isDeleteLoading }] = useRemovePlaylistMutation()
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()

  const pageNumber = Number(searchParams.get('page')) || 1
  const { data: playlists } = useFetchPlaylistsQuery({ pageNumber, userId: userId! })
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

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return

    await removePlaylist(deleteTarget.id).unwrap()
    setDeleteTarget(null)
  }

  return (
    <>
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
                userName={playlist.attributes.user.name}
                isShowReactionButtons={true}
                reaction={playlist.attributes.currentUserReaction}
                likesCount={playlist.attributes.likesCount}
                userId={playlist.attributes.user.id}
                addedAt={playlist.attributes.addedAt}
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
                          setDeleteTarget({
                            id: playlist.id,
                            title: playlist.attributes.title,
                          })
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
      <DeleteConfirmationDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null)
          }
        }}
        onConfirm={handleDeleteConfirm}
        entityType="playlist"
        entityName={deleteTarget?.title ?? ''}
        isLoading={isDeleteLoading}
      />
      <Pagination page={pageNumber} pagesCount={pagesCount} onPageChange={handlePageChange} />
    </>
  )
}
