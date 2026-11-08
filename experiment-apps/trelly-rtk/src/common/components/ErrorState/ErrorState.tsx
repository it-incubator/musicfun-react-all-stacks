import CloudOffOutlinedIcon from "@mui/icons-material/CloudOffOutlined"
import Button from "@mui/material/Button"

import { EmptyState } from "../EmptyState/EmptyState"

type Props = {
  onRetry: () => void
  title?: string
}

export const ErrorState = ({ onRetry, title = "Something went wrong" }: Props) => (
  <EmptyState
    icon={<CloudOffOutlinedIcon />}
    title={title}
    description="The server didn’t respond as expected. Please try again in a moment."
    action={
      <Button variant="contained" onClick={onRetry}>
        Try again
      </Button>
    }
  />
)
