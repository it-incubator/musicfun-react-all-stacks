import type { Meta } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '../Button'
import { TextField } from '../TextField'
import { Typography } from '../Typography'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from './index'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Dialog>

export default meta

export const BasicDialog = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Basic Dialog</Button>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogHeader>
            <Typography variant="h2">Dialog Title</Typography>
          </DialogHeader>

          <DialogContent>
            <Typography variant="body1">
              This is dialog content. Here can be any content - text, forms, images and much more.
            </Typography>
          </DialogContent>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    )
  },
}

export const FormDialog = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Form Dialog</Button>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogHeader>
            <Typography variant="h2">Sign in to Spotifun</Typography>
          </DialogHeader>

          <DialogContent>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                minWidth: '320px',
              }}
            >
              <TextField label="Email or username" placeholder="Enter email or username" />
              <TextField label="Password" type="password" placeholder="Enter password" />
            </div>
          </DialogContent>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Continue without signing in
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Sign in with API/HUB
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    )
  },
}

export const WithoutCloseButton = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Dialog without close button</Button>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogHeader showCloseButton={false}>
            <Typography variant="h2">Millions of songs.</Typography>
            <Typography variant="body1" style={{ color: 'var(--color-text-secondary)' }}>
              Free on Musicfun.
            </Typography>
          </DialogHeader>

          <DialogContent>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent)',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}
              >
                😊
              </div>
            </div>
          </DialogContent>

          <DialogFooter>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                width: '100%',
              }}
            >
              <Button variant="primary" fullWidth onClick={() => setOpen(false)}>
                Sign up with API/HUB
              </Button>
              <Button variant="secondary" fullWidth onClick={() => setOpen(false)}>
                Continue without signing in
              </Button>
            </div>
          </DialogFooter>
        </Dialog>
      </>
    )
  },
}

export const LongContent = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Dialog with long content</Button>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogHeader>
            <Typography variant="h2">Long Content</Typography>
          </DialogHeader>

          <DialogContent>
            <div style={{ maxWidth: '500px' }}>
              {Array.from({ length: 20 }, (_, i) => (
                <Typography key={i} variant="body2" style={{ marginBottom: '12px' }}>
                  This is paragraph number {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris.
                </Typography>
              ))}
            </div>
          </DialogContent>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    )
  },
}
