import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Card } from '../Card'
import { Typography } from '../Typography'
import { Pagination } from './Pagination'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    page: 1,
    pagesCount: 3,
    onPageChange: () => {},
  },
}

export const MiddlePage: Story = {
  args: {
    page: 5,
    pagesCount: 10,
    onPageChange: () => {},
  },
}

export const LastPage: Story = {
  args: {
    page: 3,
    pagesCount: 3,
    onPageChange: () => {},
  },
}

export const ManyPages: Story = {
  args: {
    page: 8,
    pagesCount: 20,
    onPageChange: () => {},
  },
}

export const SinglePage: Story = {
  args: {
    page: 1,
    pagesCount: 1,
    onPageChange: () => {},
  },
}

export const Interactive = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1)
    const totalCount = 95
    const pageSize = 10
    const pagesCount = Math.ceil(totalCount / pageSize)

    const handlePageChange = (page: number) => {
      setCurrentPage(page)
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          alignItems: 'center',
          width: '500px',
        }}>
        <Card style={{ padding: '20px', textAlign: 'center' }}>
          <Typography variant="h3" style={{ marginBottom: '12px' }}>
            Interactive Pagination
          </Typography>
          <Typography variant="body2" style={{ marginBottom: '8px' }}>
            Current page: <strong>{currentPage}</strong>
          </Typography>
          <Typography variant="body2" style={{ marginBottom: '8px' }}>
            Total items: <strong>{totalCount}</strong>
          </Typography>
          <Typography variant="body2">
            Items per page: <strong>{pageSize}</strong>
          </Typography>
        </Card>

        <Pagination page={currentPage} pagesCount={pagesCount} onPageChange={handlePageChange} />

        <Typography variant="caption" style={{ textAlign: 'center' }}>
          Click on page numbers or arrows to navigate
        </Typography>
      </div>
    )
  },
}

export const AllStates = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        alignItems: 'center',
        width: '600px',
      }}>
      <div>
        <Typography variant="h3" style={{ marginBottom: '12px', textAlign: 'center' }}>
          First Page (3 pages total)
        </Typography>
        <Pagination page={1} pagesCount={3} onPageChange={() => {}} />
      </div>

      <div>
        <Typography variant="h3" style={{ marginBottom: '12px', textAlign: 'center' }}>
          Middle Page (10 pages total)
        </Typography>
        <Pagination page={5} pagesCount={10} onPageChange={() => {}} />
      </div>

      <div>
        <Typography variant="h3" style={{ marginBottom: '12px', textAlign: 'center' }}>
          Last Page (3 pages total)
        </Typography>
        <Pagination page={3} pagesCount={3} onPageChange={() => {}} />
      </div>

      <div>
        <Typography variant="h3" style={{ marginBottom: '12px', textAlign: 'center' }}>
          Many Pages (20 pages total)
        </Typography>
        <Pagination page={12} pagesCount={20} onPageChange={() => {}} />
      </div>
    </div>
  ),
}
