import { useEffect, useRef, useState } from 'react'

const DEFAULT_BACKGROUND_COLOR = '#3333a3'

export const usePageBackgroundColor = (
  url: string | null | undefined,
  isSuccess: boolean,
  isLocalUrlData?: boolean
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [dominantColor, setDominantColor] = useState<string>('')

  useEffect(() => {
    if (isSuccess && !url) {
      setDominantColor(DEFAULT_BACKGROUND_COLOR)
    }
    if (url) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = isLocalUrlData ? url : url + '?' //to avoid CORS error
      img.onload = () => {
        if (isLocalUrlData) {
          URL.revokeObjectURL(url)
        }
        const canvas = canvasRef.current
        if (canvas) {
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          const ctx = canvas.getContext('2d', { willReadFrequently: true })
          ctx!.drawImage(img, 0, 0)
          const step = 5
          let red = 0,
            green = 0,
            blue = 0,
            pixelsCount = 0
          for (let y = canvas.height * 0.25; y < canvas.height / 2; y += step) {
            for (let x = canvas.width * 0.25; x < canvas.width / 2; x += step) {
              const data = ctx!.getImageData(x, y, 1, 1).data
              red += data[0]
              green += data[1]
              blue += data[2]
              pixelsCount++
            }
          }
          const color = `rgb(${Math.round(red / pixelsCount)}, ${Math.round(green / pixelsCount)}, ${Math.round(blue / pixelsCount)})`
          setDominantColor(color)
        }
      }
    }
  }, [url, isSuccess])

  return { dominantColor, canvasRef }
}
