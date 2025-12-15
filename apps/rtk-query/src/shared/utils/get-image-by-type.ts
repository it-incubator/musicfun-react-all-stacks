import type { Images, ImageType } from '@/shared/types'

export const getImageByType = (images: Images, type: ImageType) => {
  return images.main.find((image) => image.type === type)
}
