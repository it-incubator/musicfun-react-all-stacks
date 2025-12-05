import type { Meta } from '@storybook/react-vite'
import { useState } from 'react'

import { Typography } from '../Typography'
import { FileUploader } from './FileUploader'

const meta = {
  title: 'Components/FileUploader',
  component: FileUploader,
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof FileUploader>

export default meta

export const Basic = {
  render: () => {
    const [file, setFile] = useState<File | null>(null)
    return (
      <div style={{ width: 400 }}>
        <FileUploader onFileSelect={setFile} value={file} onRemove={() => setFile(null)} />
        {file && (
          <Typography variant="caption" style={{ marginTop: 16, display: 'block' }}>
            Selected: {file.name}
          </Typography>
        )}
      </div>
    )
  },
}

export const Disabled = {
  render: () => <FileUploader onFileSelect={() => {}} disabled />,
}

export const Loading = {
  render: () => <FileUploader onFileSelect={() => {}} loading placeholder="Loading..." />,
}

export const Resettable = {
  render: () => {
    const [file, setFile] = useState<File | null>(null)
    return (
      <div style={{ width: 400 }}>
        <FileUploader
          onFileSelect={setFile}
          value={file}
          onRemove={() => setFile(null)}
          placeholder="Choose Track"
        />
        <button style={{ marginTop: 16 }} onClick={() => setFile(null)}>
          Reset file (external controller)
        </button>
      </div>
    )
  },
}

export const CustomPlaceholder = {
  render: () => <FileUploader onFileSelect={() => {}} placeholder="Загрузить аудиофайл" />,
}
