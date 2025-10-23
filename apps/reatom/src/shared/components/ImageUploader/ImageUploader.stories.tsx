import type { Meta, StoryObj } from '@storybook/react-vite'

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
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <ImageUploader {...args} />
    </div>
  ),
}

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Choose your avatar',
  },
  render: (args) => (
    <div style={{ width: '200px' }}>
      <ImageUploader {...args} />
    </div>
  ),
}

export const WithCustomLimits: Story = {
  args: {
    placeholder: 'Upload image (max 2MB)',
    maxSizeInMB: 2,
    acceptedFormats: ['image/jpeg', 'image/png'],
  },
  render: (args) => (
    <div style={{ width: '400px' }}>
      <ImageUploader {...args} />
    </div>
  ),
}

export const AllowAllImages: Story = {
  args: {
    placeholder: 'Upload any image format',
    acceptedFormats: ['image/*'],
    maxSizeInMB: 10,
  },
  render: (args) => (
    <div style={{ width: '350px' }}>
      <ImageUploader {...args} />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '400px',
      }}
    >
      <div>
        <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '12px' }}>Profile Avatar</h3>
        <ImageUploader
          placeholder="Upload avatar"
          onImageSelect={(file) => console.log('Avatar selected:', file.name)}
          maxSizeInMB={1}
        />
      </div>

      <div>
        <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '12px' }}>Playlist Cover</h3>
        <ImageUploader
          placeholder="Upload Cover Image"
          onImageSelect={(file) => console.log('Cover selected:', file.name)}
          maxSizeInMB={5}
        />
      </div>
    </div>
  ),
}
