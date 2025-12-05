import type { Meta, StoryObj } from '@storybook/react-vite'

import { Card } from '../Card'
import { Typography } from '../Typography'
import { Skeleton } from './Skeleton'

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    width: 200,
    height: 16,
  },
}

export const Circle: Story = {
  args: {
    circle: true,
    width: 60,
    height: 60,
  },
}

export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <div>
        <Typography variant="caption" style={{ display: 'block', marginBottom: '8px' }}>
          Обычный скелетон
        </Typography>
        <Skeleton width={200} height={16} />
      </div>

      <div>
        <Typography variant="caption" style={{ display: 'block', marginBottom: '8px' }}>
          Круглый скелетон
        </Typography>
        <Skeleton circle width={50} height={50} />
      </div>

      <div>
        <Typography variant="caption" style={{ display: 'block', marginBottom: '8px' }}>
          Широкий блок
        </Typography>
        <Skeleton width="100%" height={100} />
      </div>

      <div>
        <Typography variant="caption" style={{ display: 'block', marginBottom: '8px' }}>
          Узкий блок
        </Typography>
        <Skeleton width={100} height={20} />
      </div>
    </div>
  ),
}

export const TrackExample = {
  render: () => (
    <div style={{ width: '400px' }}>
      <Typography variant="h3" style={{ marginBottom: '16px' }}>
        Пример загрузки треков
      </Typography>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Skeleton circle width={50} height={50} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Skeleton width="60%" height={16} />
              <Skeleton width="40%" height={14} />
            </div>
            <Skeleton width={30} height={14} />
          </div>
        ))}
      </div>
    </div>
  ),
}

export const CardExample = {
  render: () => (
    <div style={{ width: '500px' }}>
      <Typography variant="h3" style={{ marginBottom: '16px' }}>
        Пример карточек
      </Typography>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
        }}>
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i} style={{ padding: '16px' }}>
            <Skeleton width="100%" height={100} style={{ marginBottom: '12px' }} />
            <Skeleton width="80%" height={16} style={{ marginBottom: '8px' }} />
            <Skeleton width="60%" height={14} />
          </Card>
        ))}
      </div>
    </div>
  ),
}
