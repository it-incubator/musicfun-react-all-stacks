/*
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '../Button'
import { Card } from '../Card'
import { Typography } from '../Typography'
import { type CroppedArea, ImageCropper } from './ImageCropper'

const meta = {
  title: 'Components/ImageCropper',
  component: ImageCropper,
  parameters: {
    layout: 'centered',
  },
  args: {
    isOpen: false,
    onClose: () => {},
    onCropComplete: () => {},
    imageSrc: '',
  },
} satisfies Meta<typeof ImageCropper>

export default meta
type Story = StoryObj<typeof meta>

// Sample image for demonstration
const sampleImageSrc = 'https://unsplash.it/600/600'

export const SquareCrop: Story = {
  args: {
    isOpen: true,
    imageSrc: sampleImageSrc,
    cropShape: 'rect',
  },
}

export const RoundCrop: Story = {
  args: {
    isOpen: true,
    imageSrc: sampleImageSrc,
    cropShape: 'round',
  },
}
*/
