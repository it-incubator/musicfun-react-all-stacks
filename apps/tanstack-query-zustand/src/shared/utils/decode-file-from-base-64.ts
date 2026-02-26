export const decodeFileFromBase64 = (data: string | null) => {
  if (!data) return null

  const mimeType = data.split(';')[0].split(':')[1]
  const base64Url = data.split(',')[1]

  const binaryString = atob(base64Url)
  const binaryLength = binaryString.length
  const bytes = new Uint8Array(binaryLength)

  for (let i = 0; i < binaryLength; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  const blob = new Blob([bytes], { type: mimeType })
  return URL.createObjectURL(blob)
}
