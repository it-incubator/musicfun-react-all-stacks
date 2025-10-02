import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { Area } from 'react-easy-crop'

import { Card } from '../Card'
import { Typography } from '../Typography'
import { ImageUploader } from './ImageUploader'

const meta = {
  title: 'Components/ImageUploader',
  component: ImageUploader,
  parameters: {
    layout: 'centered',
  },
  args: {
    onImageSelect: () => {},
  },
} satisfies Meta<typeof ImageUploader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Upload Cover Image',
    enableCrop: true,
    cropShape: 'rect',
    aspectRatio: 1,
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <ImageUploader {...args} />
    </div>
  ),
}

export const WithoutCropping: Story = {
  args: {
    placeholder: 'Upload Image (No Crop)',
    enableCrop: false,
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <ImageUploader {...args} />
    </div>
  ),
}

export const RoundCrop: Story = {
  args: {
    placeholder: 'Upload Avatar Image',
    enableCrop: true,
    cropShape: 'round',
    aspectRatio: 1,
    cropTitle: 'Crop Your Avatar',
    cropDescription: 'Position your face in the center of the circle',
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <ImageUploader {...args} />
    </div>
  ),
}

export const BannerCrop: Story = {
  args: {
    placeholder: 'Upload Banner Image',
    enableCrop: true,
    cropShape: 'rect',
    aspectRatio: 16 / 9,
    cropTitle: 'Create Banner',
    cropDescription: 'Crop your image to fit banner dimensions (16:9)',
  },
  render: (args) => (
    <div style={{ width: '400px' }}>
      <ImageUploader {...args} />
    </div>
  ),
}

export const PortraitCrop: Story = {
  args: {
    placeholder: 'Upload Portrait Image',
    enableCrop: true,
    cropShape: 'rect',
    aspectRatio: 3 / 4,
    cropTitle: 'Crop Portrait',
    cropDescription: 'Create a portrait crop with 3:4 aspect ratio',
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <ImageUploader {...args} />
    </div>
  ),
}

export const CustomFileRestrictions: Story = {
  args: {
    placeholder: 'Upload JPEG/PNG only',
    acceptedFormats: ['image/jpeg', 'image/png'],
    enableCrop: true,
    cropShape: 'rect',
    aspectRatio: 1,
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <ImageUploader {...args} />
      <Typography
        variant="caption"
        style={{
          marginTop: '8px',
          display: 'block',
        }}>
        Accepts only JPEG/PNG files up to 2MB
      </Typography>
    </div>
  ),
}

export const Interactive = {
  render: () => {
    const [uploadedImages, setUploadedImages] = useState<
      Array<{
        file: File
        croppedArea?: Area
        type: string
        url: string
      }>
    >([])

    const handleImageSelect = (type: string) => (file: File, croppedArea?: Area) => {
      const url = URL.createObjectURL(file)
      setUploadedImages((prev) => [
        ...prev,
        {
          file,
          croppedArea,
          type,
          url,
        },
      ])
    }

    const clearResults = () => {
      // Cleanup URLs to prevent memory leaks
      uploadedImages.forEach((img) => URL.revokeObjectURL(img.url))
      setUploadedImages([])
    }

    const uploaderConfigs = [
      {
        id: 'square',
        title: 'Square Crop',
        placeholder: 'Upload Square Image',
        cropShape: 'rect' as const,
        aspectRatio: 1,
        cropTitle: 'Square Crop',
        width: '250px',
      },
      {
        id: 'round',
        title: 'Round Avatar',
        placeholder: 'Upload Avatar',
        cropShape: 'round' as const,
        aspectRatio: 1,
        cropTitle: 'Avatar Crop',
        width: '250px',
      },
      {
        id: 'banner',
        title: 'Banner Crop',
        placeholder: 'Upload Banner',
        cropShape: 'rect' as const,
        aspectRatio: 16 / 9,
        cropTitle: 'Banner Crop',
        width: '350px',
      },
      {
        id: 'no-crop',
        title: 'No Cropping',
        placeholder: 'Upload Original',
        enableCrop: false,
        width: '250px',
      },
    ]

    return (
      <div
        style={{
          width: '100%',
          maxWidth: '800px',
        }}>
        <Typography
          variant="h2"
          style={{
            marginBottom: '24px',
            textAlign: 'center',
          }}>
          Interactive Image Uploader
        </Typography>

        <Card
          style={{
            padding: '20px',
            marginBottom: '20px',
          }}>
          <Typography variant="h3" style={{ marginBottom: '16px' }}>
            Try Different Upload Types
          </Typography>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '20px',
            }}>
            {uploaderConfigs.map((config) => (
              <div key={config.id} style={{ width: config.width }}>
                <Typography
                  variant="body2"
                  style={{
                    marginBottom: '8px',
                    fontWeight: '600',
                  }}>
                  {config.title}
                </Typography>
                <ImageUploader
                  placeholder={config.placeholder}
                  enableCrop={config.enableCrop ?? true}
                  cropShape={config.cropShape}
                  aspectRatio={config.aspectRatio}
                  cropTitle={config.cropTitle}
                  onImageSelect={handleImageSelect(config.title)}
                />
              </div>
            ))}
          </div>
        </Card>

        {uploadedImages.length > 0 && (
          <Card style={{ padding: '20px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}>
              <Typography variant="h3">Uploaded Images ({uploadedImages.length})</Typography>
              <button
                onClick={clearResults}
                style={{
                  padding: '6px 12px',
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border-base)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}>
                Clear All
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
              }}>
              {uploadedImages.map((image, index) => (
                <div
                  key={index}
                  style={{
                    border: '1px solid var(--color-border-base)',
                    borderRadius: '8px',
                    padding: '12px',
                    backgroundColor: 'var(--color-bg-secondary)',
                  }}>
                  <img
                    src={image.url}
                    alt={`Uploaded ${image.type}`}
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      marginBottom: '8px',
                    }}
                  />
                  <Typography
                    variant="body3"
                    style={{
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}>
                    {image.type}
                  </Typography>
                  <Typography variant="caption">
                    {Math.round(image.file.size / 1024)} KB
                    {image.croppedArea && (
                      <span style={{ display: 'block' }}>
                        {Math.round(image.croppedArea.width)}×{Math.round(image.croppedArea.height)}
                        px
                      </span>
                    )}
                  </Typography>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div
          style={{
            marginTop: '20px',
            textAlign: 'center',
          }}>
          <Typography variant="caption">
            Upload images using different cropping modes to see the results
          </Typography>
        </div>
      </div>
    )
  },
}

export const AllVariants = {
  render: () => {
    const [results, setResults] = useState<Record<string, { file: File; url: string }>>({})

    const handleImageSelect = (variant: string) => (file: File) => {
      const url = URL.createObjectURL(file)
      setResults((prev) => ({
        ...prev,
        [variant]: {
          file,
          url,
        },
      }))
    }

    const variants = [
      {
        key: 'square',
        title: 'Square (1:1)',
        cropShape: 'rect' as const,
        aspectRatio: 1,
      },
      {
        key: 'round',
        title: 'Round Avatar',
        cropShape: 'round' as const,
        aspectRatio: 1,
      },
      {
        key: 'banner',
        title: 'Banner (16:9)',
        cropShape: 'rect' as const,
        aspectRatio: 16 / 9,
      },
      {
        key: 'portrait',
        title: 'Portrait (3:4)',
        cropShape: 'rect' as const,
        aspectRatio: 3 / 4,
      },
      {
        key: 'landscape',
        title: 'Landscape (4:3)',
        cropShape: 'rect' as const,
        aspectRatio: 4 / 3,
      },
      {
        key: 'no-crop',
        title: 'No Cropping',
        enableCrop: false,
      },
    ]

    return (
      <div
        style={{
          width: '100%',
          maxWidth: '1000px',
        }}>
        <Typography
          variant="h2"
          style={{
            marginBottom: '24px',
            textAlign: 'center',
          }}>
          All ImageUploader Variants
        </Typography>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}>
          {variants.map((variant) => (
            <Card key={variant.key} style={{ padding: '16px' }}>
              <Typography
                variant="h3"
                style={{
                  marginBottom: '12px',
                  textAlign: 'center',
                }}>
                {variant.title}
              </Typography>

              <ImageUploader
                placeholder={`Upload ${variant.title}`}
                enableCrop={variant.enableCrop ?? true}
                cropShape={variant.cropShape}
                aspectRatio={variant.aspectRatio}
                onImageSelect={handleImageSelect(variant.key)}
              />

              {results[variant.key] && (
                <div
                  style={{
                    marginTop: '12px',
                    textAlign: 'center',
                  }}>
                  <img
                    src={results[variant.key].url}
                    alt={`Result for ${variant.title}`}
                    style={{
                      width: '100%',
                      maxHeight: '120px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      marginBottom: '8px',
                    }}
                  />
                  <Typography variant="caption">
                    {Math.round(results[variant.key].file.size / 1024)} KB
                  </Typography>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
          }}>
          <Typography variant="caption">
            Upload images to see how different crop settings affect the result
          </Typography>
        </div>
      </div>
    )
  },
}
