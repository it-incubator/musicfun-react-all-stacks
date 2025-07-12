import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

import { Card, Skeleton } from '@/shared/components'

import s from '../PlaylistCard/PlaylistCard.module.css'

export type PlaylistCardSkeletonProps = {
  showReactionButtons?: boolean
  className?: string
} & ComponentProps<'div'>

export const PlaylistCardSkeleton = ({
  showReactionButtons = false,
  className,
  ...props
}: PlaylistCardSkeletonProps) => {
  return (
    <Card
      className={clsx(s.card, showReactionButtons && s.withReactionButtons, className)}
      {...props}>
      <Skeleton width="100%" height={153} className={s.image} />

      <Skeleton width="80%" height={16} className={s.title} />

      <Skeleton width="60%" height={14} className={s.description} />

      {showReactionButtons && (
        <div className={s.reactionButtons}>
          <Skeleton circle width={28} height={28} />
          <Skeleton circle width={28} height={28} />
        </div>
      )}
    </Card>
  )
}
