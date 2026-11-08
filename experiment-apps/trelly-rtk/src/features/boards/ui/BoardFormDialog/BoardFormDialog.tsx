import { zodResolver } from "@hookform/resolvers/zod"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router"

import { showNotificationAC } from "@/app/model/app-slice.ts"
import { LIMITS } from "@/common/constants"
import { useAppDispatch } from "@/common/hooks"
import { boardPath } from "@/common/routing"

import { useCreateBoardMutation, useReplaceBoardMutation } from "../../api/boardsApi.ts"
import type { Board } from "../../api/boardsApi.types.ts"
import { type BoardInputs, boardSchema } from "../../lib/boardSchema.ts"

type Props = {
  open: boolean
  onClose: () => void
  // edit mode when a board is passed, otherwise create mode
  board?: Board
}

export const BoardFormDialog = ({ open, onClose, board }: Props) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    {/* remount the form on every open to reset its values */}
    {open && <BoardForm board={board} onClose={onClose} />}
  </Dialog>
)

const BoardForm = ({ board, onClose }: Omit<Props, "open">) => {
  const isEdit = !!board
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [createBoard, { isLoading: isCreating }] = useCreateBoardMutation()
  const [replaceBoard, { isLoading: isSaving }] = useReplaceBoardMutation()

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<BoardInputs>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      title: board?.attributes.title ?? "",
      description: board?.attributes.description ?? "",
      isImportant: board?.attributes.isImportant ?? false,
    },
  })

  const descriptionLength = watch("description").length

  const onSubmit = async ({ title, description, isImportant }: BoardInputs) => {
    try {
      if (board) {
        // PUT — full replacement of the board attributes
        await replaceBoard({ boardId: board.id, title, description: description || null, isImportant }).unwrap()
        dispatch(showNotificationAC({ message: "Board updated" }))
        onClose()
      } else {
        const { data } = await createBoard({ title, description: description || null }).unwrap()
        dispatch(showNotificationAC({ message: "Board created" }))
        onClose()
        navigate(boardPath(data.id))
      }
    } catch {
      // error is shown by the base query
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogTitle>{isEdit ? "Edit board" : "Create board"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            label="Title"
            autoFocus
            fullWidth
            required
            error={!!errors.title}
            helperText={errors.title?.message}
            slotProps={{ htmlInput: { maxLength: LIMITS.titleMaxLength } }}
            {...register("title")}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            maxRows={10}
            error={!!errors.description}
            helperText={errors.description?.message ?? `${descriptionLength}/${LIMITS.descriptionMaxLength}`}
            {...register("description")}
          />
          {isEdit && (
            <Controller
              name="isImportant"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                  label="Mark as important"
                />
              )}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={isCreating || isSaving}>
          {isEdit ? "Save" : "Create board"}
        </Button>
      </DialogActions>
    </form>
  )
}
