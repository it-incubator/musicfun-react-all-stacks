import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import type { SchemaPlaylistImagesOutputDto } from '@/shared/api/schema.ts'
import { Paths } from '@/shared/config/paths.ts'
import {
  Card,
  CoverImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Typography,
} from '@/shared/components'
import { featuresFlags } from '@/shared/featureFlags.ts'
import { useDeletePlaylistAction } from '@/shared/hooks/useDeletePlaylistAction'
import { DeleteIcon, EditIcon, MoreIcon } from '@/shared/icons'
import { formatCreatedDate, VU } from '@/shared/utils'

import s from './PlaylistCard.module.scss'

interface PlaylistCardProps {
  id: string
  title?: string
  images?: SchemaPlaylistImagesOutputDto
  footer?: React.ReactNode
  canEdit?: boolean
  userName?: string
  userId?: string
  addedAt?: string
  tracksCount?: number
  shouldShowOwnerName?: boolean
  shouldShowCreatedDate?: boolean
}

export const PlaylistCard: React.FC<PlaylistCardProps> = (props) => {
  const {
    title,
    images,
    id,
    footer,
    canEdit = false,
    userName,
    userId,
    addedAt,
    tracksCount,
    shouldShowOwnerName = false,
    shouldShowCreatedDate = false,
  } = props

  const { t } = useTranslation()
  const handleDeletePlaylist = useDeletePlaylistAction(id)

  const imageSrc = VU.isNotEmptyArray(images?.main) ? images.main[0].url : undefined

  const handleUserNameClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <Card className={s.card}>
      <Link to={`${Paths.Playlists}/${id}`} className={s.image}>
        <CoverImage imageSrc={imageSrc} imageDescription={'cover'} aria-hidden />
      </Link>
      <div className={s.titleWrapper}>
        <Typography variant="h3" className={s.title}>
          {title}
        </Typography>
        {canEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <EditIcon className={s.menuIcon} />
                <span>Edit</span>
              </DropdownMenuItem>
              {featuresFlags.deletePlaylist && (
                <DropdownMenuItem onClick={handleDeletePlaylist} className={s.deleteItem}>
                  <DeleteIcon className={s.menuIcon} />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className={s.details}>
        {shouldShowOwnerName && (
          <div className={s.madeFor}>
            <Typography variant="body2" as="span" className={s.madeForText}>
              {t('playlist.made_for')}{' '}
            </Typography>
            <Link
              to={`${Paths.Profile}/${userId}`}
              className={s.userLink}
              onClick={handleUserNameClick}>
              {userName}
            </Link>
          </div>
        )}

        <div className={s.detailsRow}>
          {tracksCount != null && (
            <Typography variant="body2" className={s.tracks}>
              {t('playlist.tracks_count', { count: tracksCount })}
            </Typography>
          )}
          {shouldShowCreatedDate && (
            <>
              <span className={s.dot} aria-hidden="true" />
              <Typography variant="body2" className={s.created}>
                {formatCreatedDate(addedAt)}
              </Typography>
            </>
          )}
        </div>
      </div>

      {footer}
    </Card>
  )
}
