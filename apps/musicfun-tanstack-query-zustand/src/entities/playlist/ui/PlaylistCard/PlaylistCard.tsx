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
import shared from '@/shared/styles/shared.module.css'
import { VU } from '@/shared/utils'

import s from './PlaylistCard.module.css'

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

  const imageSrc = React.useMemo(() => {
    return VU.isValidArray(images?.main) ? images.main[0].url : void 0
  }, [images?.main])

  if (!VU.isValidString(id)) {
    return null
  }

  return (
    <Card as={Link} to={`/playlists/${id}`} className={s.card}>
      <div className={s.image}>
        <CoverImage imageSrc={imageSrc} imageDescription={'cover'} aria-hidden />
      </div>
      <Typography variant="h3" className={s.title}>
        {VU.isValid(title) && title}
      </Typography>
      <Typography variant="body3" className={s.description}>
        {VU.isValid(description) && description}
      </Typography>
      <div>
        {canEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreIcon />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <EditIcon className={shared.menuIcon} />
                <span>Edit</span>
              </DropdownMenuItem>
              {featuresFlags.deletePlaylist && (
                <DropdownMenuItem onClick={handleDeletePlaylist} className={shared.deleteItem}>
                  <DeleteIcon className={shared.menuIcon} />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {VU.isValid(footer) && footer}
    </Card>
  )
}
