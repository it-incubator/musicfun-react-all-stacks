import type { ComponentProps } from 'react'

import noCoverPlaceholder from '@/assets/img/no-cover.png'

type Props = {
  imageSrc?: string | undefined
  imageDescription: string
} & ComponentProps<'img'>

export const CoverImage = ({ imageSrc, imageDescription, ...props }: Props) => {
  return <img src={imageSrc ? imageSrc : noCoverPlaceholder} alt={imageDescription} {...props} />
}
