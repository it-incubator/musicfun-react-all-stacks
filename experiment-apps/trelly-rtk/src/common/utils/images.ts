import type { ImageSizeType, ImageVariant } from "@/common/types"

/**
 * Picks the best image variant. Previews (medium/thumbnail) are generated
 * about a minute after upload, so we fall back to the original.
 */
export const pickImage = (images: ImageVariant[] | undefined, preferred: ImageSizeType[] = ["original"]) => {
  if (!images?.length) return null
  for (const type of preferred) {
    const image = images.find((i) => i.type === type)
    if (image) return image
  }
  return images[0]
}

const GRADIENTS = [
  "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
  "linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)",
  "linear-gradient(135deg, #14B8A6 0%, #0EA5E9 100%)",
  "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
  "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)",
  "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)",
  "linear-gradient(135deg, #F97316 0%, #EC4899 100%)",
  "linear-gradient(135deg, #64748B 0%, #334155 100%)",
]

/** Stable placeholder cover for boards without an image */
export const getGradientById = (id: string) => {
  let hash = 0
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) | 0
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length]
}

export const readImageSize = (file: File) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(url)
    }
    img.onerror = () => {
      reject(new Error("File is not a supported image"))
      URL.revokeObjectURL(url)
    }
    img.src = url
  })
