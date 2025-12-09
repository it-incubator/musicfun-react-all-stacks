import * as React from 'react'
import { Link } from 'react-router'

import type { SchemaPlaylistImagesOutputDto } from '@/shared/api/schema.ts'
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
import { VU } from '@/shared/utils'

import s from './PlaylistCard.module.scss'

interface PlaylistCardProps {
  id: string
  title?: string
  images?: SchemaPlaylistImagesOutputDto
  description: string | null
  footer?: React.ReactNode
  canEdit?: boolean
}

export const PlaylistCard: React.FC<PlaylistCardProps> = (props) => {
  const { title, images, description, id, footer, canEdit = false } = props

  const handleDeletePlaylist = useDeletePlaylistAction(id)

  const imageSrc = VU.isNotEmptyArray(images?.main) ? images.main[0].url : undefined

  return (
    <Card as={Link} to={`/playlists/${id}`} className={s.card}>
      <div className={s.image}>
        <CoverImage imageSrc={imageSrc} imageDescription={'cover'} aria-hidden />
      </div>
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
      <Typography variant="body3" className={s.description}>
        {description}
      </Typography>
      {footer}
    </Card>
  )
}
