import clsx from 'clsx'
import type { ComponentProps } from 'react'

import noCoverPlaceholder from '@/assets/img/no-cover.png'

import s from './CoverImage.styles.module.scss'

type Props = {
  imageSrc?: string
  imageDescription: string
} & ComponentProps<'img'>

export const CoverImage = ({ imageSrc, imageDescription, ...props }: Props) => {
  return (
    <div className={clsx(s.coverImage, props.className)}>
      <img src={imageSrc || noCoverPlaceholder} alt={imageDescription} {...props} />
    </div>
  )
}
