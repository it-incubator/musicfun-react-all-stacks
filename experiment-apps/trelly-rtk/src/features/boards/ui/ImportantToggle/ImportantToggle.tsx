import StarIcon from "@mui/icons-material/Star"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import IconButton from "@mui/material/IconButton"
import type { SxProps, Theme } from "@mui/material/styles"
import Tooltip from "@mui/material/Tooltip"

import { usePatchBoardMutation } from "../../api/boardsApi.ts"
import type { Board } from "../../api/boardsApi.types.ts"

type Props = {
  board: Board
  sx?: SxProps<Theme>
}

export const ImportantToggle = ({ board, sx }: Props) => {
  const [patchBoard] = usePatchBoardMutation()
  const { isImportant, title } = board.attributes

  return (
    <Tooltip title={isImportant ? "Unmark important" : "Mark as important"}>
      <IconButton
        size="small"
        aria-label={isImportant ? `Unmark board ${title} as important` : `Mark board ${title} as important`}
        aria-pressed={isImportant}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          patchBoard({ boardId: board.id, isImportant: !isImportant })
        }}
        sx={sx}
      >
        {isImportant ? (
          <StarIcon fontSize="small" sx={{ color: "secondary.main" }} />
        ) : (
          <StarBorderIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  )
}
