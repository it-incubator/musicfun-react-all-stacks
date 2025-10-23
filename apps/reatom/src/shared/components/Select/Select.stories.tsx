import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Select } from './Select'

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const commonOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'vanilla', label: 'Vanilla JS' },
]

const genres = [
  { value: 'pop', label: 'Pop' },
  { value: 'rock', label: 'Rock' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'classical', label: 'Classical' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'hip-hop', label: 'Hip Hop' },
  { value: 'country', label: 'Country' },
]

export const AllVariants = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '350px',
      }}>
      <Select label="Basic Select" placeholder="Choose option" options={commonOptions} />

      <Select label="With Default Value" options={commonOptions} defaultValue="react" />

      <Select
        label="With Error"
        placeholder="Choose option"
        options={commonOptions}
        errorMessage="This field is required"
      />

      <Select label="Disabled" placeholder="Cannot select" options={commonOptions} disabled />
    </div>
  ),
}

export const Basic: Story = {
  args: {
    label: 'Choose framework',
    placeholder: 'Select a framework',
    options: commonOptions,
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <Select {...args} />
    </div>
  ),
}

export const WithDefaultValue: Story = {
  args: {
    label: 'Preferred framework',
    options: commonOptions,
    defaultValue: 'react',
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <Select {...args} />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    label: 'Framework (disabled)',
    placeholder: 'Cannot select',
    options: commonOptions,
    disabled: true,
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <Select {...args} />
    </div>
  ),
}

export const WithError: Story = {
  args: {
    label: 'Framework',
    placeholder: 'Select a framework',
    options: commonOptions,
    errorMessage: 'Please select a framework',
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <Select {...args} />
    </div>
  ),
}

export const WithDisabledOptions: Story = {
  args: {
    label: 'Music Genre',
    placeholder: 'Choose your favorite genre',
    options: [
      { value: 'pop', label: 'Pop' },
      { value: 'rock', label: 'Rock' },
      { value: 'jazz', label: 'Jazz (Coming Soon)', disabled: true },
      { value: 'classical', label: 'Classical' },
      { value: 'electronic', label: 'Electronic (Coming Soon)', disabled: true },
      { value: 'hip-hop', label: 'Hip Hop' },
    ],
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <Select {...args} />
    </div>
  ),
}

export const Controlled = {
  render: () => {
    const [value, setValue] = useState('')

    return (
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Select
          label="Music Genre"
          placeholder="Select genre"
          options={genres}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div
          style={{
            padding: '12px',
            backgroundColor: 'var(--color-bg-card)',
            borderRadius: '4px',
            fontSize: 'var(--font-size-s)',
            color: 'var(--color-text-secondary)',
          }}>
          Selected value: <strong>{value || 'None'}</strong>
        </div>
      </div>
    )
  },
}
