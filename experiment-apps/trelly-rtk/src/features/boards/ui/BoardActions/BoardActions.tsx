import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import StarIcon from "@mui/icons-material/Star"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import type { SxProps, Theme } from "@mui/material/styles"
import Tooltip from "@mui/material/Tooltip"
import { type MouseEvent, useState } from "react"

import { showNotificationAC } from "@/app/model/app-slice.ts"
import { ConfirmDialog } from "@/common/components"
import { useAppDispatch } from "@/common/hooks"

import { useDeleteBoardMutation, usePatchBoardMutation, useReorderBoardMutation } from "../../api/boardsApi.ts"
import type { Board } from "../../api/boardsApi.types.ts"
import { useCoverUpload } from "../../lib/useCoverUpload.tsx"
import { BoardFormDialog } from "../BoardFormDialog/BoardFormDialog.tsx"

type Props = {
  board: Board
  isFirst?: boolean
  onDeleted?: () => void
  buttonSx?: SxProps<Theme>
}

// Clicks inside a card must not trigger the card link
const stop = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
}

export const BoardActions = ({ board, isFirst, onDeleted, buttonSx }: Props) => {
  const dispatch = useAppDispatch()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const [patchBoard] = usePatchBoardMutation()
  const [deleteBoard] = useDeleteBoardMutation()
  const [reorderBoard] = useReorderBoardMutation()
  const cover = useCoverUpload(board.id)

  const { title, isImportant } = board.attributes

  const closeMenu = () => setAnchorEl(null)
  const runAndClose = (fn: () => void) => () => {
    closeMenu()
    fn()
  }

  // PATCH — change only one attribute
  const toggleImportant = () => patchBoard({ boardId: board.id, isImportant: !isImportant })

  const deleteHandler = async () => {
    try {
      onDeleted?.()
      await deleteBoard(board.id).unwrap()
      dispatch(showNotificationAC({ message: `Board “${title}” deleted` }))
    } catch {
      // error is shown by the base query
    }
  }

  return (
    <>
      {cover.input}
      <Tooltip title="Board actions">
        <IconButton
          size="small"
          aria-label={`Actions for board ${title}`}
          onClick={(e) => {
            stop(e)
            setAnchorEl(e.currentTarget)
          }}
          onPointerDown={(e) => e.stopPropagation()}
          sx={buttonSx}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={closeMenu}
        onClick={(e) => e.stopPropagation()}
        slotProps={{ paper: { sx: { minWidth: 220, border: 1, borderColor: "divider" } } }}
      >
        <MenuItem onClick={runAndClose(() => setIsEditOpen(true))}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Edit board
        </MenuItem>
        <MenuItem onClick={runAndClose(cover.open)} disabled={cover.isUploading}>
          <ListItemIcon>
            <ImageOutlinedIcon fontSize="small" />
          </ListItemIcon>
          {cover.isUploading ? "Uploading cover…" : "Change cover"}
        </MenuItem>
        <MenuItem onClick={runAndClose(toggleImportant)}>
          <ListItemIcon>
            {isImportant ? <StarIcon fontSize="small" color="secondary" /> : <StarBorderIcon fontSize="small" />}
          </ListItemIcon>
          {isImportant ? "Unmark important" : "Mark as important"}
        </MenuItem>
        {isFirst === false && (
          <MenuItem onClick={runAndClose(() => reorderBoard({ boardId: board.id, putAfterItemId: null }))}>
            <ListItemIcon>
              <VerticalAlignTopIcon fontSize="small" />
            </ListItemIcon>
            Move to first
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={runAndClose(() => setIsDeleteOpen(true))} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete board
        </MenuItem>
      </Menu>

      <BoardFormDialog open={isEditOpen} onClose={() => setIsEditOpen(false)} board={board} />
      <ConfirmDialog
        open={isDeleteOpen}
        title="Delete board?"
        description={<>“{title}” will be deleted together with all its tasks and files. This can’t be undone.</>}
        onConfirm={deleteHandler}
        onClose={() => setIsDeleteOpen(false)}
      />
    </>
  )
}
