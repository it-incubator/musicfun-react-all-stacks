import type { Meta } from '@storybook/react-vite'
import { useState } from 'react'

import { Card } from '../Card'
import { Typography } from '../Typography'
import { TagEditor } from './TagEditor'

const meta = {
  title: 'Components/TagEditor',
  component: TagEditor,
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof TagEditor>

export default meta

export const Basic = {
  render: () => {
    const [tags, setTags] = useState<string[]>([])

    return (
      <div style={{ width: '400px' }}>
        <TagEditor label="Tags" placeholder="Add tag and press Enter" value={tags} onTagsChange={setTags} />
      </div>
    )
  },
}

export const WithMaxTags = {
  render: () => {
    const [tags, setTags] = useState<string[]>([])

    return (
      <div style={{ width: '400px' }}>
        <TagEditor
          label="Skills (max 5)"
          placeholder="Add skill and press Enter"
          value={tags}
          onTagsChange={setTags}
          maxTags={5}
        />
      </div>
    )
  },
}

export const Disabled = {
  render: () => {
    const [tags, setTags] = useState(['React', 'TypeScript'])

    return (
      <div style={{ width: '400px' }}>
        <TagEditor
          label="Tags (disabled)"
          placeholder="Cannot add tags"
          value={tags}
          onTagsChange={setTags}
          disabled={true}
        />
      </div>
    )
  },
}

export const PrefilledTags = {
  render: () => {
    const [tags, setTags] = useState(['JavaScript', 'TypeScript', 'React', 'Node.js', 'CSS', 'HTML'])

    return (
      <div style={{ width: '450px' }}>
        <TagEditor
          label="Programming Languages & Technologies"
          placeholder="Add more technologies..."
          value={tags}
          onTagsChange={setTags}
          maxTags={10}
        />
      </div>
    )
  },
}

export const Interactive = {
  render: () => {
    const [frontendTags, setFrontendTags] = useState(['React', 'Vue.js'])
    const [backendTags, setBackendTags] = useState(['Node.js'])

    return (
      <div
        style={{
          width: '500px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div>
          <Typography variant="h3" style={{ marginBottom: '16px' }}>
            Frontend Technologies
          </Typography>
          <TagEditor
            label="Frontend"
            placeholder="Add frontend technology..."
            value={frontendTags}
            onTagsChange={setFrontendTags}
            maxTags={8}
          />
        </div>

        <div>
          <Typography variant="h3" style={{ marginBottom: '16px' }}>
            Backend Technologies
          </Typography>
          <TagEditor
            label="Backend"
            placeholder="Add backend technology..."
            value={backendTags}
            onTagsChange={setBackendTags}
            maxTags={6}
          />
        </div>

        <Card>
          <Typography variant="body2" style={{ marginBottom: '8px' }}>
            Summary:
          </Typography>
          <Typography variant="caption" style={{ display: 'block', marginBottom: '4px' }}>
            Frontend: {frontendTags.length > 0 ? frontendTags.join(', ') : 'None'}
          </Typography>
          <Typography variant="caption" style={{ display: 'block' }}>
            Backend: {backendTags.length > 0 ? backendTags.join(', ') : 'None'}
          </Typography>
        </Card>
      </div>
    )
  },
}
