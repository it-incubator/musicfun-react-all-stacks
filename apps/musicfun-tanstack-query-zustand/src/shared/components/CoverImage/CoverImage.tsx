import type { ComponentProps } from 'react'

import noCoverPlaceholder from '@/assets/img/no-cover.png'

import s from './CoverImage.styles.module.scss'

type Props = {
  imageSrc?: string | undefined
  imageDescription: string
} & ComponentProps<'img'>

export const CoverImage = ({ imageSrc, imageDescription, ...props }: Props) => {
  return (
    <div className={s.coverImageWrapper}>
      <img src={imageSrc ? imageSrc : noCoverPlaceholder} alt={imageDescription} {...props} />
    </div>
  )
}
