import type { Meta } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '../Button'
import { Card } from '../Card'
import { Typography } from '../Typography'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof Tabs>

export default meta

export const BasicTabs = {
  render: () => (
    <div style={{ width: '400px' }}>
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Typography variant="body1">Make changes to your account here.</Typography>
        </TabsContent>
        <TabsContent value="password">
          <Typography variant="body1">Change your password here.</Typography>
        </TabsContent>
      </Tabs>
    </div>
  ),
}

export const ControlledTabs = {
  render: () => {
    const [activeTab, setActiveTab] = useState('tab1')

    return (
      <div style={{ width: '500px' }}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <Typography variant="h3" style={{ marginBottom: '12px' }}>
              First Tab Content
            </Typography>
            <Typography variant="body2">
              This is content for the first tab. You can put any React content here.
            </Typography>
          </TabsContent>
          <TabsContent value="tab2">
            <Typography variant="h3" style={{ marginBottom: '12px' }}>
              Second Tab Content
            </Typography>
            <Typography variant="body2">This is content for the second tab with different information.</Typography>
          </TabsContent>
          <TabsContent value="tab3">
            <Typography variant="h3" style={{ marginBottom: '12px' }}>
              Third Tab Content
            </Typography>
            <Typography variant="body2">And this is the third tab with its own unique content.</Typography>
          </TabsContent>
        </Tabs>

        <Card
          style={{
            marginTop: '20px',
          }}
        >
          <Typography variant="body2">
            Active tab: <strong>{activeTab}</strong>
          </Typography>
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={() => setActiveTab('tab1')}>
              Go to Tab 1
            </Button>
            <Button variant="secondary" onClick={() => setActiveTab('tab2')}>
              Go to Tab 2
            </Button>
            <Button variant="secondary" onClick={() => setActiveTab('tab3')}>
              Go to Tab 3
            </Button>
          </div>
        </Card>
      </div>
    )
  },
}

export const DisabledTab = {
  render: () => (
    <div style={{ width: '350px' }}>
      <Tabs defaultValue="available">
        <TabsList>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="disabled" disabled>
            Disabled
          </TabsTrigger>
          <TabsTrigger value="another">Another</TabsTrigger>
        </TabsList>
        <TabsContent value="available">
          <Typography variant="body1">This tab is available and active.</Typography>
        </TabsContent>
        <TabsContent value="disabled">
          <Typography variant="body1">This content should not be visible.</Typography>
        </TabsContent>
        <TabsContent value="another">
          <Typography variant="body1">This is another available tab.</Typography>
        </TabsContent>
      </Tabs>
    </div>
  ),
}
