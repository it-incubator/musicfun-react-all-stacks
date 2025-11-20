import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '../Button'
import { Card } from '../Card'
import { Typography } from '../Typography'
import { Progress } from './Progress'

const meta = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    value: 75,
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <Progress {...args} />
    </div>
  ),
}

export const CustomMax: Story = {
  args: {
    value: 15,
    max: 20,
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <Progress {...args} />
    </div>
  ),
}

export const Empty: Story = {
  args: {
    value: 0,
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <Progress {...args} />
    </div>
  ),
}

export const Full: Story = {
  args: {
    value: 100,
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <Progress {...args} />
    </div>
  ),
}

export const AllStates = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '400px' }}>
      <div>
        <Typography variant="h3" style={{ marginBottom: '8px' }}>
          Empty (0%)
        </Typography>
        <Progress value={0} />
      </div>

      <div>
        <Typography variant="h3" style={{ marginBottom: '8px' }}>
          Low (25%)
        </Typography>
        <Progress value={25} />
      </div>

      <div>
        <Typography variant="h3" style={{ marginBottom: '8px' }}>
          Medium (50%)
        </Typography>
        <Progress value={50} />
      </div>

      <div>
        <Typography variant="h3" style={{ marginBottom: '8px' }}>
          High (85%)
        </Typography>
        <Progress value={85} />
      </div>

      <div>
        <Typography variant="h3" style={{ marginBottom: '8px' }}>
          Complete (100%)
        </Typography>
        <Progress value={100} />
      </div>
    </div>
  ),
}

export const CustomSizes = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '400px' }}>
      <div>
        <Typography variant="h3" style={{ marginBottom: '8px' }}>
          Small (height: 4px)
        </Typography>
        <Progress value={70} style={{ height: '4px' }} />
      </div>

      <div>
        <Typography variant="h3" style={{ marginBottom: '8px' }}>
          Default (height: 8px)
        </Typography>
        <Progress value={70} />
      </div>

      <div>
        <Typography variant="h3" style={{ marginBottom: '8px' }}>
          Large (height: 12px)
        </Typography>
        <Progress value={70} style={{ height: '12px' }} />
      </div>
    </div>
  ),
}

export const Interactive = {
  render: () => {
    const [progress, setProgress] = useState(0)

    const handleIncrease = () => {
      setProgress((prev) => Math.min(prev + 10, 100))
    }

    const handleDecrease = () => {
      setProgress((prev) => Math.max(prev - 10, 0))
    }

    const handleReset = () => {
      setProgress(0)
    }

    return (
      <div style={{ width: '400px' }}>
        <Card style={{ padding: '24px' }}>
          <Typography variant="h3" style={{ marginBottom: '16px' }}>
            Interactive Progress
          </Typography>

          <div style={{ marginBottom: '16px' }}>
            <Typography variant="body2" style={{ marginBottom: '8px' }}>
              Current progress: {progress}%
            </Typography>
            <Progress value={progress} />
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <Button variant="secondary" onClick={handleDecrease} disabled={progress === 0}>
              -10%
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="primary" onClick={handleIncrease} disabled={progress === 100}>
              +10%
            </Button>
          </div>
        </Card>
      </div>
    )
  },
}

export const FileUploadExample = {
  render: () => (
    <div style={{ width: '400px' }}>
      <Card style={{ padding: '24px' }}>
        <Typography variant="h3" style={{ marginBottom: '16px' }}>
          File Upload Progress
        </Typography>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <Typography variant="body2">image.jpg</Typography>
              <Typography variant="body2">75%</Typography>
            </div>
            <Progress value={75} />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <Typography variant="body2">document.pdf</Typography>
              <Typography variant="body2">100%</Typography>
            </div>
            <Progress value={100} />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <Typography variant="body2">video.mp4</Typography>
              <Typography variant="body2">32%</Typography>
            </div>
            <Progress value={32} />
          </div>
        </div>
      </Card>
    </div>
  ),
}
